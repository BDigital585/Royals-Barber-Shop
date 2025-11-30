// Google Sheets Integration for Royals Barber Shop
// Connected via Replit's Google Sheets connector
import { google } from 'googleapis';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=google-sheet',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('Google Sheet not connected');
  }
  return accessToken;
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
export async function getUncachableGoogleSheetClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.sheets({ version: 'v4', auth: oauth2Client });
}

// Get Google Drive client for creating spreadsheets
export async function getUncachableGoogleDriveClient() {
  const accessToken = await getAccessToken();

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({
    access_token: accessToken
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

// Sheet names
const LEADERBOARD_SHEET_NAME = 'memory match leaderboard';
const CONTACTS_SHEET_NAME = 'barber shop Contacts';

// Cache for spreadsheet IDs
let leaderboardSpreadsheetId: string | null = null;
let contactsSpreadsheetId: string | null = null;

// Find spreadsheet by name
async function findSpreadsheetByName(name: string): Promise<string | null> {
  try {
    const drive = await getUncachableGoogleDriveClient();
    const response = await drive.files.list({
      q: `name='${name}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id || null;
    }
    return null;
  } catch (error) {
    console.error(`Error finding spreadsheet "${name}":`, error);
    return null;
  }
}

// Create a new spreadsheet with headers
async function createLeaderboardSpreadsheet(): Promise<string> {
  const sheets = await getUncachableGoogleSheetClient();
  
  const response = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: LEADERBOARD_SHEET_NAME,
      },
      sheets: [
        {
          properties: {
            title: 'Leaderboard',
          },
        },
      ],
    },
  });

  const spreadsheetId = response.data.spreadsheetId!;

  // Add headers
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: 'Leaderboard!A1:F1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [['Rank', 'Name', 'Email', 'Phone', 'Score (Moves)', 'Date']],
    },
  });

  console.log(`Created leaderboard spreadsheet: ${spreadsheetId}`);
  return spreadsheetId;
}

// Get or create leaderboard spreadsheet
export async function getLeaderboardSpreadsheetId(): Promise<string> {
  if (leaderboardSpreadsheetId) {
    return leaderboardSpreadsheetId;
  }

  // Try to find existing spreadsheet
  const existingId = await findSpreadsheetByName(LEADERBOARD_SHEET_NAME);
  if (existingId) {
    leaderboardSpreadsheetId = existingId;
    return existingId;
  }

  // Create new spreadsheet
  leaderboardSpreadsheetId = await createLeaderboardSpreadsheet();
  return leaderboardSpreadsheetId;
}

// Get contacts spreadsheet ID
export async function getContactsSpreadsheetId(): Promise<string | null> {
  if (contactsSpreadsheetId) {
    return contactsSpreadsheetId;
  }

  const existingId = await findSpreadsheetByName(CONTACTS_SHEET_NAME);
  if (existingId) {
    contactsSpreadsheetId = existingId;
    return existingId;
  }

  console.warn(`Contacts spreadsheet "${CONTACTS_SHEET_NAME}" not found`);
  return null;
}

// Add score to leaderboard spreadsheet
export async function addScoreToLeaderboard(
  name: string,
  email: string,
  phone: string | null,
  score: number
): Promise<void> {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const spreadsheetId = await getLeaderboardSpreadsheetId();

    // Get all existing scores to calculate rank
    const existingData = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Leaderboard!A2:F',
    });

    const rows = existingData.data.values || [];
    
    // Calculate rank (1 = best/lowest moves)
    const rank = rows.filter(row => parseInt(row[4]) < score).length + 1;

    // Add new row
    const newRow = [
      rank,
      name,
      email,
      phone || '',
      score,
      new Date().toISOString().split('T')[0], // Date in YYYY-MM-DD format
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Leaderboard!A:F',
      valueInputOption: 'RAW',
      requestBody: {
        values: [newRow],
      },
    });

    // Re-calculate all ranks after adding new score
    await recalculateRanks(spreadsheetId);

    console.log(`Added score to leaderboard: ${name} - ${score} moves`);
  } catch (error) {
    console.error('Error adding score to leaderboard:', error);
    throw error;
  }
}

// Recalculate ranks in the spreadsheet
async function recalculateRanks(spreadsheetId: string): Promise<void> {
  const sheets = await getUncachableGoogleSheetClient();

  // Get all data
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'Leaderboard!A2:F',
  });

  const rows = response.data.values || [];
  if (rows.length === 0) return;

  // Sort by score (moves - lower is better)
  const sortedRows = rows
    .map((row, index) => ({ row, originalIndex: index }))
    .sort((a, b) => parseInt(a.row[4]) - parseInt(b.row[4]));

  // Assign new ranks
  sortedRows.forEach((item, index) => {
    item.row[0] = index + 1; // Rank
  });

  // Update all rows with new ranks
  const updatedValues = sortedRows.map(item => item.row);

  // Clear and rewrite data
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: 'Leaderboard!A2:F',
  });

  if (updatedValues.length > 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Leaderboard!A2:F',
      valueInputOption: 'RAW',
      requestBody: {
        values: updatedValues,
      },
    });
  }
}

// Check if email exists in contacts spreadsheet
export async function emailExistsInContacts(email: string): Promise<boolean> {
  try {
    const spreadsheetId = await getContactsSpreadsheetId();
    if (!spreadsheetId) {
      return false;
    }

    const sheets = await getUncachableGoogleSheetClient();
    
    // Get all emails from contacts (assuming email is in column B or search all columns)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A:Z', // Check all columns
    });

    const rows = response.data.values || [];
    
    // Check if email exists in any cell
    for (const row of rows) {
      for (const cell of row) {
        if (typeof cell === 'string' && cell.toLowerCase() === email.toLowerCase()) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking contacts:', error);
    return false;
  }
}

// Add contact to contacts spreadsheet if not duplicate
export async function addContactIfNotDuplicate(
  name: string,
  email: string,
  phone: string | null
): Promise<boolean> {
  try {
    const spreadsheetId = await getContactsSpreadsheetId();
    if (!spreadsheetId) {
      console.warn('Contacts spreadsheet not found, skipping contact add');
      return false;
    }

    // Check if email already exists
    const exists = await emailExistsInContacts(email);
    if (exists) {
      console.log(`Contact already exists: ${email}`);
      return false;
    }

    const sheets = await getUncachableGoogleSheetClient();

    // Add new contact
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A:D',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[name, email, phone || '', new Date().toISOString().split('T')[0]]],
      },
    });

    console.log(`Added new contact: ${name} - ${email}`);
    return true;
  } catch (error) {
    console.error('Error adding contact:', error);
    return false;
  }
}

// Get weekly leaderboard scores (scores from current week, Monday to Sunday)
export async function getWeeklyLeaderboard(): Promise<Array<{
  rank: number;
  name: string;
  email: string;
  phone: string | null;
  score: number;
  date: string;
}>> {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const spreadsheetId = await getLeaderboardSpreadsheetId();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Leaderboard!A2:F',
    });

    const rows = response.data.values || [];
    
    // Get the start of the current week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    // Filter to only this week's scores
    const weeklyScores = rows
      .filter(row => {
        const scoreDate = new Date(row[5]);
        return scoreDate >= monday;
      })
      .map(row => ({
        rank: parseInt(row[0]),
        name: row[1],
        email: row[2],
        phone: row[3] || null,
        score: parseInt(row[4]),
        date: row[5],
      }))
      .sort((a, b) => a.score - b.score);

    // Recalculate ranks for weekly view
    return weeklyScores.map((score, index) => ({
      ...score,
      rank: index + 1,
    }));
  } catch (error) {
    console.error('Error getting weekly leaderboard:', error);
    return [];
  }
}

// Check if email or phone has already played this week
export async function hasPlayedThisWeek(email: string, phone: string | null): Promise<boolean> {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const spreadsheetId = await getLeaderboardSpreadsheetId();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Leaderboard!A2:F',
    });

    const rows = response.data.values || [];
    
    // Get the start of the current week (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    // Check if email or phone exists in this week's scores
    for (const row of rows) {
      const scoreDate = new Date(row[5]);
      if (scoreDate >= monday) {
        const rowEmail = row[2]?.toLowerCase();
        const rowPhone = row[3]?.replace(/\D/g, ''); // Strip non-digits for comparison
        const inputPhone = phone?.replace(/\D/g, '');
        
        if (rowEmail === email.toLowerCase()) {
          return true;
        }
        if (inputPhone && rowPhone && rowPhone === inputPhone) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking weekly play limit:', error);
    return false; // Allow play if check fails
  }
}

// Get all scores for the current month (for monthly winner determination)
export async function getMonthlyLeaderboard(): Promise<Array<{
  rank: number;
  name: string;
  email: string;
  phone: string | null;
  score: number;
  date: string;
}>> {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const spreadsheetId = await getLeaderboardSpreadsheetId();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Leaderboard!A2:F',
    });

    const rows = response.data.values || [];
    
    // Get the start of the current month
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);

    // Filter to only this month's scores
    const monthlyScores = rows
      .filter(row => {
        const scoreDate = new Date(row[5]);
        return scoreDate >= monthStart;
      })
      .map(row => ({
        rank: parseInt(row[0]),
        name: row[1],
        email: row[2],
        phone: row[3] || null,
        score: parseInt(row[4]),
        date: row[5],
      }))
      .sort((a, b) => a.score - b.score);

    // Recalculate ranks for monthly view
    return monthlyScores.map((score, index) => ({
      ...score,
      rank: index + 1,
    }));
  } catch (error) {
    console.error('Error getting monthly leaderboard:', error);
    return [];
  }
}

// Get the monthly winner (lowest score this month)
export async function getMonthlyWinner(): Promise<{
  name: string;
  email: string;
  phone: string | null;
  score: number;
  date: string;
} | null> {
  const monthlyScores = await getMonthlyLeaderboard();
  if (monthlyScores.length === 0) return null;
  
  return monthlyScores[0]; // First place (lowest moves)
}

// Clear all scores from the leaderboard (monthly reset)
export async function clearLeaderboard(): Promise<boolean> {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const spreadsheetId = await getLeaderboardSpreadsheetId();

    // Clear all data except headers
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: 'Leaderboard!A2:F',
    });

    console.log('Leaderboard cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing leaderboard:', error);
    return false;
  }
}

// Get all scores (no date filter) for archiving
export async function getAllScores(): Promise<Array<{
  rank: number;
  name: string;
  email: string;
  phone: string | null;
  score: number;
  date: string;
}>> {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const spreadsheetId = await getLeaderboardSpreadsheetId();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Leaderboard!A2:F',
    });

    const rows = response.data.values || [];
    
    return rows
      .map(row => ({
        rank: parseInt(row[0]),
        name: row[1],
        email: row[2],
        phone: row[3] || null,
        score: parseInt(row[4]),
        date: row[5],
      }))
      .sort((a, b) => a.score - b.score)
      .map((score, index) => ({
        ...score,
        rank: index + 1,
      }));
  } catch (error) {
    console.error('Error getting all scores:', error);
    return [];
  }
}
