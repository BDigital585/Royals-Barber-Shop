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
const NEW_CLIENTS_SHEET_NAME = 'New Barber Shop Clients';

// 4-week cycle system - starts December 1, 2025
const CYCLE_START_DATE_MS = new Date('2025-12-01T00:00:00').getTime();
const CYCLE_LENGTH_WEEKS = 4;
const CYCLE_LENGTH_DAYS = CYCLE_LENGTH_WEEKS * 7; // 28 days
const DAY_MS = 24 * 60 * 60 * 1000;

// Calculate current 4-week cycle info
// Returns fresh Date instances - never mutates shared state
export function getCurrentCycleInfo(): {
  cycleNumber: number;
  cycleStart: Date;
  cycleEnd: Date;
  currentWeek: number;
  daysRemaining: number;
} {
  const now = new Date();
  const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  
  // Calculate days since the first cycle started
  const daysSinceStart = Math.floor((todayMs - CYCLE_START_DATE_MS) / DAY_MS);
  
  // If we're before the start date, we're in cycle 1 (pre-cycle period)
  if (daysSinceStart < 0) {
    const cycleStart = new Date(CYCLE_START_DATE_MS);
    const cycleEnd = new Date(CYCLE_START_DATE_MS + (CYCLE_LENGTH_DAYS - 1) * DAY_MS);
    return {
      cycleNumber: 1,
      cycleStart,
      cycleEnd,
      currentWeek: 1,
      daysRemaining: CYCLE_LENGTH_DAYS + daysSinceStart,
    };
  }
  
  // Calculate which cycle we're in (0-indexed, then add 1)
  const cycleNumber = Math.floor(daysSinceStart / CYCLE_LENGTH_DAYS) + 1;
  
  // Calculate the start of the current cycle (fresh Date instance)
  const cycleStartDays = (cycleNumber - 1) * CYCLE_LENGTH_DAYS;
  const cycleStartMs = CYCLE_START_DATE_MS + cycleStartDays * DAY_MS;
  const cycleStart = new Date(cycleStartMs);
  
  // Calculate the end of the current cycle (fresh Date instance)
  const cycleEndMs = cycleStartMs + (CYCLE_LENGTH_DAYS - 1) * DAY_MS;
  const cycleEnd = new Date(cycleEndMs);
  
  // Calculate which week of the cycle we're in (1-4)
  const daysIntoCycle = daysSinceStart - cycleStartDays;
  const currentWeek = Math.floor(daysIntoCycle / 7) + 1;
  
  // Calculate days remaining in the cycle
  const daysRemaining = CYCLE_LENGTH_DAYS - daysIntoCycle - 1;
  
  return {
    cycleNumber,
    cycleStart,
    cycleEnd,
    currentWeek: Math.min(currentWeek, 4),
    daysRemaining: Math.max(0, daysRemaining),
  };
}

// Cache for spreadsheet ID (all tabs will be in the same spreadsheet)
let leaderboardSpreadsheetId: string | null = null;

// Track which tabs have been verified/created
let contactsTabCreated = false;
let newClientsTabCreated = false;

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

// Check if a tab exists in the spreadsheet
async function tabExists(spreadsheetId: string, tabName: string): Promise<boolean> {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: 'sheets.properties.title',
    });
    
    const existingTabs = response.data.sheets?.map(s => s.properties?.title) || [];
    return existingTabs.includes(tabName);
  } catch (error) {
    console.error(`Error checking if tab "${tabName}" exists:`, error);
    return false;
  }
}

// Create a new tab in the spreadsheet
async function createTab(spreadsheetId: string, tabName: string, headers: string[]): Promise<void> {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    
    // Add the new tab
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: tabName,
              },
            },
          },
        ],
      },
    });
    
    // Add headers to the new tab
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${tabName}!A1:${String.fromCharCode(64 + headers.length)}1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers],
      },
    });
    
    console.log(`[ClientTracker] Created tab "${tabName}" with headers`);
  } catch (error: any) {
    console.error(`[ClientTracker] Error creating tab "${tabName}":`, error?.message || error);
    throw error;
  }
}

// Ensure Contacts tab exists in the leaderboard spreadsheet
async function ensureContactsTab(spreadsheetId: string): Promise<void> {
  if (contactsTabCreated) return;
  
  const exists = await tabExists(spreadsheetId, 'Contacts');
  if (!exists) {
    console.log('[ClientTracker] Creating Contacts tab...');
    await createTab(spreadsheetId, 'Contacts', ['Name', 'Email', 'Phone', 'Date Added']);
  }
  contactsTabCreated = true;
}

// Ensure New Clients tab exists in the leaderboard spreadsheet
async function ensureNewClientsTab(spreadsheetId: string): Promise<void> {
  if (newClientsTabCreated) return;
  
  const exists = await tabExists(spreadsheetId, 'New Clients');
  if (!exists) {
    console.log('[ClientTracker] Creating New Clients tab...');
    await createTab(spreadsheetId, 'New Clients', ['Name', 'Email', 'Phone', 'Discount Tier', 'Submitted At', 'Source']);
  }
  newClientsTabCreated = true;
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

// Add a new client to the New Clients tab (in leaderboard spreadsheet)
async function addToNewClientsTab(
  name: string,
  email: string,
  phone: string | null,
  discountTier: string
): Promise<void> {
  console.log(`[ClientTracker] Adding to New Clients tab: ${name} - ${email}`);
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const spreadsheetId = await getLeaderboardSpreadsheetId();
    
    // Ensure the tab exists
    await ensureNewClientsTab(spreadsheetId);
    console.log(`[ClientTracker] Using spreadsheet: ${spreadsheetId}`);

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'New Clients!A:F',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          name,
          email,
          phone || '',
          discountTier,
          new Date().toISOString(),
          'Memory Match Game'
        ]],
      },
    });

    console.log(`[ClientTracker] SUCCESS: Added to New Clients tab: ${name} - ${email}`);
  } catch (error: any) {
    console.error('[ClientTracker] ERROR adding to New Clients tab:', error?.message || error);
    // Don't throw - this is a secondary tracking feature
  }
}

// Track a new client - checks contacts, adds to both sheets if new
// Returns true if client was new (added), false if already existed
export async function ensureClientTracked(
  name: string,
  email: string,
  phone: string | null,
  discountTier: string
): Promise<{ isNew: boolean }> {
  console.log(`[ClientTracker] Starting client tracking for: ${email}`);
  try {
    // Check if email already exists in contacts
    console.log(`[ClientTracker] Checking if email exists in contacts...`);
    const exists = await emailExistsInContacts(email);
    
    if (exists) {
      console.log(`[ClientTracker] Client already exists in contacts: ${email}`);
      return { isNew: false };
    }

    console.log(`[ClientTracker] Email not found in contacts - this is a new client!`);
    
    // New client - add to both sheets
    // 1. Add to barber shop Contacts
    console.log(`[ClientTracker] Adding to barber shop Contacts...`);
    const addedToContacts = await addContactIfNotDuplicate(name, email, phone);
    console.log(`[ClientTracker] Added to contacts: ${addedToContacts}`);
    
    // 2. Add to New Clients tab (for tracking new clients specifically)
    if (addedToContacts) {
      console.log(`[ClientTracker] Adding to New Clients tab...`);
      await addToNewClientsTab(name, email, phone, discountTier);
      console.log(`[ClientTracker] New client fully tracked: ${name} - ${email}`);
      return { isNew: true };
    } else {
      console.log(`[ClientTracker] Failed to add to contacts, not adding to new clients sheet`);
    }

    return { isNew: false };
  } catch (error) {
    console.error('[ClientTracker] Error tracking client:', error);
    // Don't block the main flow if tracking fails
    return { isNew: false };
  }
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

// Check if email exists in Contacts tab (within leaderboard spreadsheet)
export async function emailExistsInContacts(email: string): Promise<boolean> {
  try {
    const spreadsheetId = await getLeaderboardSpreadsheetId();
    
    // Ensure the Contacts tab exists
    await ensureContactsTab(spreadsheetId);

    const sheets = await getUncachableGoogleSheetClient();
    
    // Get all emails from contacts tab
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Contacts!A:D',
    });

    const rows = response.data.values || [];
    
    // Check if email exists in any cell (column B is email)
    for (const row of rows) {
      for (const cell of row) {
        if (typeof cell === 'string' && cell.toLowerCase() === email.toLowerCase()) {
          return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('[ClientTracker] Error checking contacts:', error);
    return false;
  }
}

// Add contact to Contacts tab (within leaderboard spreadsheet) if not duplicate
export async function addContactIfNotDuplicate(
  name: string,
  email: string,
  phone: string | null
): Promise<boolean> {
  console.log(`[ClientTracker] addContactIfNotDuplicate called for: ${email}`);
  try {
    const spreadsheetId = await getLeaderboardSpreadsheetId();
    
    // Ensure the Contacts tab exists
    await ensureContactsTab(spreadsheetId);

    // Check if email already exists
    const exists = await emailExistsInContacts(email);
    if (exists) {
      console.log(`[ClientTracker] Contact already exists: ${email}`);
      return false;
    }

    const sheets = await getUncachableGoogleSheetClient();

    // Add new contact to Contacts tab
    console.log(`[ClientTracker] Appending contact to Contacts tab...`);
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Contacts!A:D',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[name, email, phone || '', new Date().toISOString().split('T')[0]]],
      },
    });

    console.log(`[ClientTracker] SUCCESS: Added new contact: ${name} - ${email}`);
    return true;
  } catch (error: any) {
    console.error('[ClientTracker] ERROR adding contact:', error?.message || error);
    return false;
  }
}

// Helper function to get current week of month info (based on Monday weeks)
export function getWeekOfMonthInfo(): { currentWeek: number; totalWeeks: number; monthName: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  // Get month name
  const monthName = now.toLocaleDateString('en-US', { month: 'long' });
  
  // Get the first day of the month
  const firstOfMonth = new Date(year, month, 1);
  firstOfMonth.setHours(0, 0, 0, 0);
  
  // Get the last day of the month
  const lastOfMonth = new Date(year, month + 1, 0);
  lastOfMonth.setHours(23, 59, 59, 999);
  
  // Find the first Monday of the month (or the Monday before if month starts mid-week)
  const firstDayOfWeek = firstOfMonth.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  // Calculate start of first week (the Monday that contains or precedes the 1st)
  // If month starts on Monday (1), that's the first week
  // Otherwise, find the Monday of the week containing the 1st
  const firstMondayOffset = firstDayOfWeek === 0 ? -6 : 1 - firstDayOfWeek;
  const firstMonday = new Date(firstOfMonth);
  firstMonday.setDate(firstOfMonth.getDate() + firstMondayOffset);
  
  // Count total weeks in the month
  // A week "belongs" to this month if any part of it falls in the month
  let totalWeeks = 0;
  const tempDate = new Date(firstOfMonth);
  
  // Start from the first of the month and count unique weeks
  while (tempDate <= lastOfMonth) {
    totalWeeks++;
    // Move to next Monday
    const dayOfWeek = tempDate.getDay();
    const daysUntilNextMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
    tempDate.setDate(tempDate.getDate() + daysUntilNextMonday);
  }
  
  // Calculate which week we're currently in (1-indexed)
  // Find the Monday of current week
  const currentDayOfWeek = now.getDay();
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  const currentMonday = new Date(now);
  currentMonday.setDate(now.getDate() + mondayOffset);
  currentMonday.setHours(0, 0, 0, 0);
  
  // Count weeks from start of month to current week
  let currentWeek = 1;
  const checkDate = new Date(firstOfMonth);
  
  while (checkDate < currentMonday) {
    const checkDayOfWeek = checkDate.getDay();
    const daysUntilNextMonday = checkDayOfWeek === 0 ? 1 : (8 - checkDayOfWeek);
    checkDate.setDate(checkDate.getDate() + daysUntilNextMonday);
    if (checkDate <= currentMonday && checkDate.getMonth() === month) {
      currentWeek++;
    }
  }
  
  // Ensure currentWeek doesn't exceed totalWeeks
  currentWeek = Math.min(currentWeek, totalWeeks);
  
  return { currentWeek, totalWeeks, monthName };
}

// Get cumulative leaderboard scores for the current 4-week cycle
// Each player's scores from multiple weeks are added together
export async function getWeeklyLeaderboard(): Promise<Array<{
  rank: number;
  name: string;
  email: string;
  phone: string | null;
  score: number; // This is now CUMULATIVE score (sum of all plays in cycle)
  weeksPlayed: number;
  lastPlayDate: string;
}>> {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const spreadsheetId = await getLeaderboardSpreadsheetId();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Leaderboard!A2:F',
    });

    const rows = response.data.values || [];
    
    // Get current cycle boundaries (fresh Date instances, no mutation)
    const cycleInfo = getCurrentCycleInfo();
    const cycleStartMs = cycleInfo.cycleStart.getTime();
    const cycleEndMs = cycleInfo.cycleEnd.getTime() + DAY_MS - 1; // End of day on cycle end date

    // Filter to only this cycle's scores
    // For the first cycle, include ALL pre-existing scores (any score before or during cycle 1)
    const cycleScores = rows.filter(row => {
      const scoreDateStr = row[5];
      if (!scoreDateStr) return false;
      const scoreDateMs = new Date(scoreDateStr).getTime();
      
      if (cycleInfo.cycleNumber === 1) {
        // First cycle includes all historical scores up to and including cycle end
        return scoreDateMs <= cycleEndMs;
      }
      // Later cycles only include scores within the cycle boundaries
      return scoreDateMs >= cycleStartMs && scoreDateMs <= cycleEndMs;
    });

    // Aggregate scores by player (using email as unique identifier)
    const playerScores = new Map<string, {
      name: string;
      email: string;
      phone: string | null;
      totalScore: number;
      weeksPlayed: number;
      lastPlayDate: string;
    }>();

    for (const row of cycleScores) {
      const email = row[2]?.toLowerCase();
      if (!email) continue;
      
      const existing = playerScores.get(email);
      const scoreValue = parseInt(row[4]) || 0;
      const playDate = row[5];
      
      if (existing) {
        // Add to cumulative total
        existing.totalScore += scoreValue;
        existing.weeksPlayed += 1;
        // Keep most recent date
        if (new Date(playDate) > new Date(existing.lastPlayDate)) {
          existing.lastPlayDate = playDate;
          existing.name = row[1]; // Use most recent name
          existing.phone = row[3] || existing.phone;
        }
      } else {
        playerScores.set(email, {
          name: row[1],
          email: row[2],
          phone: row[3] || null,
          totalScore: scoreValue,
          weeksPlayed: 1,
          lastPlayDate: playDate,
        });
      }
    }

    // Convert to array and sort by cumulative score (lowest is best)
    const sortedScores = Array.from(playerScores.values())
      .sort((a, b) => a.totalScore - b.totalScore);

    // Assign ranks
    return sortedScores.map((player, index) => ({
      rank: index + 1,
      name: player.name,
      email: player.email,
      phone: player.phone,
      score: player.totalScore,
      weeksPlayed: player.weeksPlayed,
      lastPlayDate: player.lastPlayDate,
    }));
  } catch (error) {
    console.error('Error getting cycle leaderboard:', error);
    return [];
  }
}

// Check if email or phone has already played this week (within the current cycle)
export async function hasPlayedThisWeek(email: string, phone: string | null): Promise<boolean> {
  try {
    const sheets = await getUncachableGoogleSheetClient();
    const spreadsheetId = await getLeaderboardSpreadsheetId();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Leaderboard!A2:F',
    });

    const rows = response.data.values || [];
    
    // Get current cycle info (fresh Date instances)
    const cycleInfo = getCurrentCycleInfo();
    const cycleStartMs = cycleInfo.cycleStart.getTime();
    
    // Calculate the start of the current week within the cycle
    const now = new Date();
    const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const daysIntoCycle = Math.max(0, Math.floor((todayMs - cycleStartMs) / DAY_MS));
    const weekNumber = Math.floor(daysIntoCycle / 7);
    const currentWeekStartMs = cycleStartMs + (weekNumber * 7 * DAY_MS);

    // Check if email or phone exists in this week's scores
    for (const row of rows) {
      const scoreDateStr = row[5];
      if (!scoreDateStr) continue;
      const scoreDateMs = new Date(scoreDateStr).getTime();
      
      if (scoreDateMs >= currentWeekStartMs) {
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

// Get cumulative leaderboard for the current 4-week cycle (alias for consistency)
export async function getMonthlyLeaderboard() {
  return getWeeklyLeaderboard();
}

// Determine cycle winners with tie handling
// Returns: { type: 'sole_winner' | 'two_way_tie' | 'three_plus_tie', winners: Player[] }
export async function getCycleWinners(): Promise<{
  type: 'sole_winner' | 'two_way_tie' | 'three_plus_tie' | 'no_players';
  winners: Array<{
    name: string;
    email: string;
    phone: string | null;
    score: number;
    weeksPlayed: number;
  }>;
  lowestScore: number;
}> {
  const leaderboard = await getWeeklyLeaderboard();
  
  if (leaderboard.length === 0) {
    return { type: 'no_players', winners: [], lowestScore: 0 };
  }
  
  // Find the lowest score
  const lowestScore = leaderboard[0].score;
  
  // Find all players with the lowest score
  const winners = leaderboard
    .filter(player => player.score === lowestScore)
    .map(player => ({
      name: player.name,
      email: player.email,
      phone: player.phone,
      score: player.score,
      weeksPlayed: player.weeksPlayed,
    }));
  
  // Determine the type of win
  let type: 'sole_winner' | 'two_way_tie' | 'three_plus_tie' | 'no_players';
  if (winners.length === 1) {
    type = 'sole_winner';
  } else if (winners.length === 2) {
    type = 'two_way_tie';
  } else {
    type = 'three_plus_tie';
  }
  
  return { type, winners, lowestScore };
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
