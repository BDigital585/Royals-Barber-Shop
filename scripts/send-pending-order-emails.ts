import { db } from '../db';
import { screenAdvertisingOrders } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { getUncachableResendClient } from '../server/resend-client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

async function sendPendingOrderEmails() {
  console.log('🔍 Checking for pending orders with completed payments...\n');

  // Get all pending orders
  const pendingOrders = await db.query.screenAdvertisingOrders.findMany({
    where: eq(screenAdvertisingOrders.status, 'pending'),
  });

  console.log(`Found ${pendingOrders.length} pending orders\n`);

  for (const order of pendingOrders) {
    if (!order.stripeSessionId) {
      console.log(`⏭️ Skipping order #${order.id} - no session ID`);
      continue;
    }

    try {
      // Check the session status in Stripe
      console.log(`📋 Checking order #${order.id} (Session: ${order.stripeSessionId})`);
      const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);

      if (session.payment_status === 'paid') {
        console.log(`✅ Payment confirmed for order #${order.id}`);
        
        // Update order with customer details
        const updatedOrder = await db
          .update(screenAdvertisingOrders)
          .set({
            customerName: session.customer_details?.name || 'Valued Customer',
            customerEmail: session.customer_details?.email || '',
            status: 'paid',
            stripePaymentIntentId: session.payment_intent as string,
            updatedAt: new Date(),
          })
          .where(eq(screenAdvertisingOrders.id, order.id))
          .returning();

        // Send emails for image and video packages
        if (order.packageType === 'image-package' || order.packageType === 'video-package') {
          const customerFormUrl = process.env.CUSTOMER_FORM_URL;
          const businessOwnerEmail = process.env.BUSINESS_OWNER_EMAIL;
          
          if (!customerFormUrl || !businessOwnerEmail) {
            console.warn(`⚠️ Email skipped for order #${order.id}: Missing CUSTOMER_FORM_URL or BUSINESS_OWNER_EMAIL\n`);
          } else {
            console.log(`📧 Sending emails for order #${order.id}...`);
            
            try {
              const { client: resend, fromEmail } = await getUncachableResendClient();
              
              const packageName = order.packageType === 'image-package' 
                ? 'Professional Image Creation Package ($70/year)' 
                : 'Professional Video Creation Package ($100/year)';

              const customerName = updatedOrder[0].customerName;
              const customerEmail = updatedOrder[0].customerEmail;
              const businessName = updatedOrder[0].businessName;

              // Email to customer
              await resend.emails.send({
                from: fromEmail,
                to: customerEmail,
                subject: '🎉 Screen Advertising Purchase Confirmed - Royals Barber Shop',
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #d97706;">Thank You for Your Purchase!</h2>
                    
                    <p>Hi ${customerName},</p>
                    
                    <p>We've successfully received your payment for the <strong>${packageName}</strong> at Royals Barber Shop!</p>
                    
                    <h3 style="color: #d97706;">Next Steps:</h3>
                    
                    <p>To create your custom ${order.packageType === 'image-package' ? 'image' : 'video'}, please fill out this form with your business details, logo, and any specific requests:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${customerFormUrl}" 
                         style="background-color: #d97706; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                        Complete Your Business Information Form
                      </a>
                    </div>
                    
                    <p><strong>What we need from you:</strong></p>
                    <ul>
                      <li>Business information and contact details</li>
                      <li>Your logo (high resolution)</li>
                      <li>Any specific colors, text, or messaging you'd like</li>
                      <li>Any visual preferences or examples</li>
                    </ul>
                    
                    <p>Once we receive your information, our team will create your ${order.packageType === 'image-package' ? 'image' : 'video'} and have it displayed on our in-shop screens!</p>
                    
                    <p><strong>Order Details:</strong></p>
                    <ul>
                      <li>Package: ${packageName}</li>
                      <li>Business: ${businessName}</li>
                      <li>Order ID: ${order.id}</li>
                    </ul>
                    
                    <p>If you have any questions, feel free to reply to this email or call us at 585-536-6576.</p>
                    
                    <p>Thank you for advertising with Royals Barber Shop!</p>
                    
                    <p style="color: #666; margin-top: 30px;">
                      Best regards,<br>
                      <strong>Royals Barber Shop</strong><br>
                      317 Ellicott Street, Batavia, NY<br>
                      585-536-6576
                    </p>
                  </div>
                `,
              });

              // Email to business owner
              await resend.emails.send({
                from: fromEmail,
                to: businessOwnerEmail,
                subject: `🔔 New Screen Advertising Order - ${packageName}`,
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #d97706;">New Screen Advertising Purchase!</h2>
                    
                    <p>A new ${packageName} has been purchased.</p>
                    
                    <p><strong>Order Details:</strong></p>
                    <ul>
                      <li>Order ID: ${order.id}</li>
                      <li>Package: ${packageName}</li>
                      <li>Customer: ${customerName}</li>
                      <li>Business: ${businessName}</li>
                      <li>Email: ${customerEmail}</li>
                      <li>Payment Status: Paid</li>
                    </ul>
                    
                    <p><strong>Next Steps:</strong></p>
                    <ol>
                      <li>Wait for customer to complete the information form</li>
                      <li>Create the ${order.packageType === 'image-package' ? 'professional image' : '10-15 second video'}</li>
                      <li>Upload to in-shop digital screens</li>
                      <li>Follow up with customer once live</li>
                    </ol>
                    
                    <p>Customer form link: <a href="${customerFormUrl}">${customerFormUrl}</a></p>
                    
                    <p style="color: #666; margin-top: 30px;">
                      <em>This is an automated notification from the Royals Barber Shop screen advertising system.</em>
                    </p>
                  </div>
                `,
              });

              console.log(`✉️ Emails sent successfully for order #${order.id}\n`);
            } catch (emailError) {
              console.error(`❌ Failed to send emails for order #${order.id}:`, emailError);
            }
          }
        } else {
          console.log(`ℹ️ No email needed for ${order.packageType}\n`);
        }
      } else {
        console.log(`⏳ Payment not completed yet (status: ${session.payment_status})\n`);
      }
    } catch (error) {
      console.error(`❌ Error processing order #${order.id}:`, error);
      console.log('');
    }
  }

  console.log('✨ Done!');
  process.exit(0);
}

sendPendingOrderEmails().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
