import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useState } from 'react';
import { STORE_CONFIG } from '../config/store';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildSupportMessage, buildWhatsAppUrl } from '../utils/whatsapp';

export function ContactPage() {
  usePageMeta({
    title: 'Contact Us',
    description: 'Reach Solenne Client Care via WhatsApp concierge, email, or our Mercer Street showroom.',
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Sizing & Fit Advice');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please complete your name, email, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF7F2]">
      <section className="border-b border-[#E2D9CE] bg-[#F2ECE3]/75">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#5C4332]">Client Care</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-medium text-[#2B231D]">Contact Solenne</h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#6E6359]">
            Speak directly with a footwear fit specialist on WhatsApp or leave a note for our Gulberg III, Lahore
            showroom team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Contact Details + WhatsApp Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="border border-[#E2D9CE] bg-[#F2ECE3] p-6 space-y-4">
              <h2 className="font-display text-2xl font-medium text-[#2B231D]">Direct WhatsApp Concierge</h2>
              <p className="text-sm leading-relaxed text-[#6E6359]">
                For fastest replies on shoe sizing, leather care, custom orders, or live stock checks, message our
                concierge directly on WhatsApp.
              </p>
              <a
                href={buildWhatsAppUrl(buildSupportMessage(topic))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 bg-[#5C4332] px-6 text-xs font-medium tracking-wide text-[#FAF7F2] hover:bg-[#3D2B1F] transition-colors"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Start WhatsApp Chat</span>
              </a>
            </div>

            <div className="space-y-4 border-t border-[#E2D9CE] pt-6 text-sm text-[#6E6359]">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#5C4332]" aria-hidden="true" />
                <div>
                  <p className="font-medium text-[#2B231D]">Flagship Showroom</p>
                  <p>{STORE_CONFIG.showroomAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#5C4332]" aria-hidden="true" />
                <div>
                  <p className="font-medium text-[#2B231D]">Studio Hours</p>
                  <p>{STORE_CONFIG.showroomHours}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#5C4332]" aria-hidden="true" />
                <div>
                  <p className="font-medium text-[#2B231D]">Email</p>
                  <p>{STORE_CONFIG.supportEmail}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#5C4332]" aria-hidden="true" />
                <div>
                  <p className="font-medium text-[#2B231D]">Telephone</p>
                  <p className="tabular-nums">{STORE_CONFIG.supportPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="border border-[#E2D9CE] bg-[#F2ECE3] p-8 space-y-4">
                <CheckCircle2 className="h-8 w-8 text-[#5C4332]" aria-hidden="true" />
                <h2 className="font-display text-3xl font-medium text-[#2B231D]">Message Received</h2>
                <p className="text-sm text-[#6E6359]">
                  Thank you, {name}. A Solenne client advisor will respond to {email} within one business day. For
                  immediate assistance, you may also send this inquiry via WhatsApp.
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={buildWhatsAppUrl(`Hello Solenne, ${topic}: ${message} (From: ${name}, ${email})`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-10 items-center gap-2 bg-[#5C4332] px-5 text-xs font-medium text-[#FAF7F2]"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Also Send via WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="inline-flex h-10 items-center border border-[#2B231D] px-5 text-xs font-medium text-[#2B231D]"
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="border border-[#E2D9CE] bg-[#FAF7F2] p-6 sm:p-8 space-y-5">
                <h2 className="font-display text-2xl font-medium text-[#2B231D]">Send a Note</h2>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-[#5C4332] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="h-11 w-full border border-[#DFD4C6] bg-[#FAF7F2] px-3.5 text-sm text-[#2B231D]"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-[#5C4332] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-11 w-full border border-[#DFD4C6] bg-[#FAF7F2] px-3.5 text-sm text-[#2B231D]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-topic" className="block text-xs font-medium text-[#5C4332] mb-1.5">
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="h-11 w-full border border-[#DFD4C6] bg-[#FAF7F2] px-3.5 text-sm text-[#2B231D]"
                  >
                    <option>Sizing &amp; Fit Advice</option>
                    <option>Order Status &amp; Dispatch</option>
                    <option>Returns &amp; Size Exchanges</option>
                    <option>Leather &amp; Suede Care</option>
                    <option>Private Showroom Appointment</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-[#5C4332] mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your question, preferred shoe silhouette, or order number..."
                    className="w-full border border-[#DFD4C6] bg-[#FAF7F2] p-3.5 text-sm text-[#2B231D]"
                  />
                </div>

                {error && <p className="text-xs text-[#8C3B2B]">{error}</p>}

                <button
                  type="submit"
                  className="h-11 bg-[#2B231D] px-7 text-xs font-medium tracking-wider uppercase text-[#FAF7F2] hover:bg-[#5C4332] transition-colors"
                >
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
