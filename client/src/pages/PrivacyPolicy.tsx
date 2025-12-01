import Layout from '../components/Layout';
import MetaTags from '../components/MetaTags';
import { Link } from 'wouter';
import { Shield, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <Layout>
      <MetaTags 
        title="Privacy Policy | Royals Barber & Shave"
        description="Learn how Royals Barber & Shave collects, uses, and protects your personal information including SMS/text messaging compliance."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-500 text-sm mt-1">Last Updated: December 1, 2025</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">1</span>
                  Introduction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Royals Barber & Shave ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our services, or interact with us through our scheduling system and Memory Match game. Please read this policy carefully. By using our services, you agree to the collection and use of information in accordance with this policy.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">2</span>
                  Information We Collect
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-2">Scheduling Form Data</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      When you book an appointment through our scheduling system, we collect:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1">
                      <li>Your name</li>
                      <li>Phone number</li>
                      <li>Appointment details (date, time, service requested)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-2">Memory Match Game Opt-In</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      When you participate in our Memory Match game and opt-in for rewards, we collect:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1">
                      <li>Your name</li>
                      <li>Email address</li>
                      <li>Phone number (optional)</li>
                      <li>Game performance data (for leaderboard purposes)</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-2">Automatically Collected Information</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      We may automatically collect certain information when you visit our website, including your IP address, browser type, operating system, referring URLs, and information about how you interact with our website.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">3</span>
                  How We Use Your Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Schedule and manage your appointments</li>
                  <li>Send appointment reminders and confirmations</li>
                  <li>Provide promotional offers and service updates</li>
                  <li>Administer the Memory Match game and leaderboard</li>
                  <li>Send discount codes and reward notifications</li>
                  <li>Improve our website and services</li>
                  <li>Respond to your inquiries and requests</li>
                </ul>
              </section>

              <section className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  SMS/Text Messaging Compliance
                </h2>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-800 leading-relaxed font-medium">
                    We are committed to protecting your privacy. We will not share, sell, or rent your mobile phone number to any unaffiliated third parties for marketing purposes. Data collected is used solely for the purpose of appointment reminders, promotional offers, and service updates from Royals Barber & Shave. Message and data rates may apply. Reply HELP for assistance, and STOP to cancel.
                  </p>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <p><strong>Opt-Out:</strong> You may opt out of receiving text messages at any time by replying STOP to any message you receive from us.</p>
                  <p><strong>Help:</strong> For assistance with our text messaging program, reply HELP to any message or contact us directly.</p>
                  <p><strong>Message Frequency:</strong> Message frequency varies based on your appointments and promotional campaigns.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">4</span>
                  Information Sharing
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this policy. We may share your information with trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or others' rights, property, or safety.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">5</span>
                  Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems and are required to keep the information confidential.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">6</span>
                  Your Rights
                </h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt out of marketing communications at any time</li>
                  <li>Withdraw consent for SMS/text messages by replying STOP</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">7</span>
                  Changes to This Policy
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes.
                </p>
              </section>

              <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>317 Ellicott St, Batavia, NY 14020</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>(585) 536-6576</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>royalbarber585@gmail.com</span>
                  </div>
                </div>
              </section>

              <div className="pt-4 border-t border-gray-200">
                <Link href="/" className="text-primary hover:text-primary/80 font-medium">
                  &larr; Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
