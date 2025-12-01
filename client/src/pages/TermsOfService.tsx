import Layout from '../components/Layout';
import MetaTags from '../components/MetaTags';
import { Link } from 'wouter';
import { FileText, Phone, Mail, MapPin, MessageSquare, Scissors, Gamepad2 } from 'lucide-react';

export default function TermsOfService() {
  return (
    <Layout>
      <MetaTags 
        title="Terms of Service | Royals Barber & Shave"
        description="Read the terms and conditions for using Royals Barber & Shave website, booking services, and SMS text message program."
      />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Terms of Service</h1>
                <p className="text-gray-500 text-sm mt-1">Last Updated: December 1, 2025</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">1</span>
                  Acceptance of Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Welcome to Royals Barber & Shave. By accessing or using our website, booking services, or participating in any of our programs, you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services. We reserve the right to modify these Terms at any time, and your continued use of our services constitutes acceptance of any changes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">2</span>
                  Use of Website
                </h2>
                <div className="space-y-3 text-gray-700 leading-relaxed">
                  <p>
                    You agree to use our website only for lawful purposes and in a way that does not infringe upon the rights of others or restrict or inhibit their use of the website. Prohibited behavior includes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Harassing or causing distress to any person</li>
                    <li>Transmitting obscene or offensive content</li>
                    <li>Disrupting the normal flow of dialogue on our website</li>
                    <li>Attempting to gain unauthorized access to our systems</li>
                    <li>Using automated systems to access our website without permission</li>
                  </ul>
                </div>
              </section>

              <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Scissors className="w-6 h-6 text-primary" />
                  Booking Services
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Appointment Scheduling</h3>
                    <p className="text-sm">
                      When booking an appointment through our website or scheduling system, you agree to provide accurate and complete information. Appointments are subject to availability and confirmation.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Cancellation Policy</h3>
                    <p className="text-sm">
                      We appreciate advance notice if you need to cancel or reschedule your appointment. Please contact us as soon as possible to allow other customers the opportunity to book.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">No-Shows</h3>
                    <p className="text-sm">
                      Repeated no-shows may result in restrictions on future booking privileges. We value all our customers and ask for mutual respect of everyone's time.
                    </p>
                  </div>
                </div>
              </section>

              <section className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  Text Message Program (SMS)
                </h2>
                <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                  <p className="text-gray-800 leading-relaxed font-medium">
                    By opting into the Royals Barber & Shave text message program, you consent to receive recurring mobile messages regarding appointment reminders, promotional offers, and service updates. Message frequency varies. Standard message and data rates may apply. For support, text HELP to our number. To cancel the service at any time, text STOP to our number. You understand that this service is subject to these Terms and Conditions.
                  </p>
                </div>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <p><strong>Consent:</strong> By providing your mobile phone number and opting in, you expressly consent to receive text messages from Royals Barber & Shave.</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <p><strong>Message Types:</strong> Messages may include appointment reminders, promotional offers, discount codes, service updates, and Memory Match game notifications.</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <p><strong>Opt-Out:</strong> You may opt out at any time by texting STOP. After opting out, you will receive a confirmation message and will no longer receive messages from us.</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <p><strong>Help:</strong> For assistance, text HELP or contact us directly at (585) 536-6576.</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-100">
                    <p><strong>Carrier Disclaimer:</strong> Carriers are not liable for delayed or undelivered messages. Message and data rates may apply based on your mobile plan.</p>
                  </div>
                </div>
              </section>

              <section className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Gamepad2 className="w-6 h-6 text-amber-600" />
                  Memory Match Game Terms
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Eligibility</h3>
                    <p>
                      The Memory Match game is open to all website visitors. To receive discount rewards and participate in the leaderboard competition, you must provide valid contact information.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Play Limits</h3>
                    <p>
                      Each participant may play once per week (Monday through Sunday). Multiple plays within the same week are not permitted and may result in disqualification.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Discount Rewards</h3>
                    <p>
                      Discount codes earned through the game are for single use only, have expiration dates, and are not valid on Tuesdays during the $20 haircut promotion. Discounts cannot be combined with other offers.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Leaderboard Competition</h3>
                    <p>
                      The 4-week cycle leaderboard competition requires weekly participation. Players who miss a week may be removed from the leaderboard. Prizes are awarded at the end of each cycle based on cumulative scores.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">3</span>
                  Intellectual Property
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Royals Barber & Shave or its content suppliers and is protected by copyright and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content without our express written permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">4</span>
                  Disclaimer of Warranties
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Our website and services are provided "as is" without any warranties, express or implied. We do not warrant that the website will be uninterrupted, error-free, or free of viruses or other harmful components. We make no warranties regarding the accuracy, reliability, or completeness of any content on the website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">5</span>
                  Limitation of Liability
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  To the fullest extent permitted by law, Royals Barber & Shave shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our website or services, including but not limited to loss of data, revenue, or profits.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">6</span>
                  Indemnification
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree to indemnify and hold harmless Royals Barber & Shave, its owners, employees, and affiliates from any claims, damages, losses, or expenses arising from your use of our website or services, your violation of these Terms, or your violation of any rights of a third party.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">7</span>
                  Governing Law
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts of Genesee County, New York.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">8</span>
                  Changes to Terms
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services after any changes indicates your acceptance of the new Terms.
                </p>
              </section>

              <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us:
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

              <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-4">
                <Link href="/" className="text-primary hover:text-primary/80 font-medium">
                  &larr; Back to Home
                </Link>
                <Link href="/privacy-policy" className="text-primary hover:text-primary/80 font-medium">
                  View Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
