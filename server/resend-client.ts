// Resend Email Client for Royals Barber Shop
// Connected via Replit's Resend connector
import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key, 
    fromEmail: connectionSettings.settings.from_email || 'royalbarber585@gmail.com'
  };
}

export async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: credentials.fromEmail
  };
}

// Send discount email after game completion
export async function sendDiscountEmail(
  toEmail: string,
  playerName: string,
  moves: number,
  discountAmount: number
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const discountCode = generateDiscountCode(toEmail, discountAmount);
    const expiryDate = getWeekEndDate();
    
    const result = await client.emails.send({
      from: `Royals Barber Shop <${fromEmail}>`,
      to: toEmail,
      subject: `You Won $${discountAmount} Off Your Next Haircut!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .discount-box { background: white; border: 3px dashed #f59e0b; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
            .discount-amount { font-size: 48px; font-weight: bold; color: #f59e0b; }
            .code { background: #1f2937; color: white; padding: 10px 20px; border-radius: 5px; font-family: monospace; font-size: 18px; display: inline-block; margin: 10px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
            .moves { color: #059669; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Congratulations, ${playerName}!</h1>
              <p>You completed the Memory Match Game!</p>
            </div>
            <div class="content">
              <p>Great job completing the game in <span class="moves">${moves} moves</span>!</p>
              
              <div class="discount-box">
                <div class="discount-amount">$${discountAmount} OFF</div>
                <p>Your Next Haircut!</p>
                <div class="code">${discountCode}</div>
                <p><strong>Show this email in person to redeem</strong></p>
                <p style="color: #dc2626; font-weight: bold;">Use by: ${expiryDate} (Saturday)</p>
              </div>
              
              <p><strong>How to Redeem:</strong></p>
              <ul>
                <li>Show this email on your phone when you visit</li>
                <li>Valid for one haircut only</li>
                <li>Cannot be combined with other offers</li>
                <li><strong>Not valid on Tuesdays</strong> with our $20 haircut promotion</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0; display: flex; gap: 10px; justify-content: center;">
                <a href="https://royalsbarbershop.setmore.com" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Book Now</a>
                <a href="tel:585-536-6576" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Call Now</a>
              </div>
              
              <p><strong>Royals Barber Shop</strong><br>
              317 Ellicott St<br>
              Batavia, NY<br>
              📞 <a href="tel:585-536-6576">585-536-6576</a><br>
              🌐 <a href="https://royalsbatavia.com">royalsbatavia.com</a></p>
            </div>
            <div class="footer">
              <p>This is an automated email from Royals Barber Shop Memory Match Game.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('Discount email sent:', result);
    return true;
  } catch (error) {
    console.error('Failed to send discount email:', error);
    return false;
  }
}

// Send winner email for free haircut (monthly winner)
export async function sendWinnerEmail(
  toEmail: string,
  playerName: string,
  moves: number,
  month: string
): Promise<boolean> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    const winnerCode = generateWinnerCode(toEmail);
    const expiryDate = getBusinessDaysFromNow(5);
    
    const result = await client.emails.send({
      from: `Royals Barber Shop <${fromEmail}>`,
      to: toEmail,
      subject: `YOU WON! Free Haircut - ${month} Memory Match Champion!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669, #047857); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .crown { font-size: 60px; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .winner-box { background: white; border: 3px solid #059669; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
            .free-text { font-size: 48px; font-weight: bold; color: #059669; }
            .code { background: #1f2937; color: #10b981; padding: 15px 30px; border-radius: 5px; font-family: monospace; font-size: 20px; display: inline-block; margin: 10px 0; }
            .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
            .urgent { background: #fef2f2; border: 2px solid #dc2626; padding: 15px; border-radius: 5px; color: #dc2626; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="crown">👑</div>
              <h1>CONGRATULATIONS, ${playerName}!</h1>
              <p>You are the ${month} Memory Match Champion!</p>
            </div>
            <div class="content">
              <p>With an incredible score of <strong>${moves} moves</strong>, you've earned the top spot on our monthly leaderboard!</p>
              
              <div class="winner-box">
                <div class="free-text">FREE HAIRCUT</div>
                <p>You've Won a Complimentary Haircut!</p>
                <div class="code">${winnerCode}</div>
                <p><strong>Show this email in person to redeem</strong></p>
              </div>
              
              <div class="urgent">
                <strong>⚠️ IMPORTANT: Use your free haircut by Saturday of this week!</strong><br>
                Expiry Date: <strong>${expiryDate}</strong>
              </div>
              
              <p><strong>How to Redeem:</strong></p>
              <ul>
                <li>Visit Royals Barber Shop by Saturday of this week</li>
                <li>Show this email on your phone</li>
                <li>Enjoy your FREE haircut!</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0; display: flex; gap: 10px; justify-content: center;">
                <a href="https://royalsbarbershop.setmore.com" style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Book Now</a>
                <a href="tel:585-536-6576" style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Call Now</a>
              </div>
              
              <p>Thank you for playing and being a valued customer!</p>
              
              <p style="margin-top: 30px;">
                <strong>Royals Barber Shop</strong><br>
                317 Ellicott St<br>
                Batavia, NY<br>
                📞 <a href="tel:585-536-6576">585-536-6576</a><br>
                🌐 <a href="https://royalsbatavia.com">royalsbatavia.com</a>
              </p>
            </div>
            <div class="footer">
              <p>This is an automated email from Royals Barber Shop Memory Match Game.</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('Winner email sent:', result);
    return true;
  } catch (error) {
    console.error('Failed to send winner email:', error);
    return false;
  }
}

// Helper functions
function generateDiscountCode(email: string, amount: number): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const emailHash = email.split('@')[0].slice(0, 3).toUpperCase();
  return `ROYALS${amount}-${emailHash}${timestamp}`;
}

function generateWinnerCode(email: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const emailHash = email.split('@')[0].slice(0, 3).toUpperCase();
  return `WINNER-${emailHash}${timestamp}`;
}

function getWeekEndDate(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  // Calculate days until Saturday (day 6)
  const daysUntilSaturday = dayOfWeek === 6 ? 0 : (6 - dayOfWeek + 7) % 7 || 6;
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + daysUntilSaturday);
  return saturday.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function getBusinessDaysFromNow(days: number): string {
  const date = new Date();
  let businessDays = 0;
  
  while (businessDays < days) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDays++;
    }
  }
  
  return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
