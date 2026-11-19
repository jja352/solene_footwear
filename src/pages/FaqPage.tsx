import { ChevronDown, MessageCircle, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildSupportMessage, buildWhatsAppUrl } from '../utils/whatsapp';

interface FaqItem {
  id: string;
  category: 'Sizing & Fit' | 'WhatsApp Ordering' | 'Shipping & Returns' | 'Care & Materials';
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Sizing & Fit',
    question: 'Do Solenne sneakers and formal shoes run true to size?',
    answer:
      'Yes. All Solenne men’s and women’s silhouettes are lasted to standard US sizing. If you are between sizes in narrow-toe heels or unlined loafers, we recommend taking your true size for suede (which molds naturally) or half a size up for structured calfskin.',
  },
  {
    id: 'faq-2',
    category: 'WhatsApp Ordering',
    question: 'How does direct WhatsApp ordering work?',
    answer:
      'On any product page, bag drawer, or checkout screen, clicking "Order via WhatsApp" automatically generates a pre-filled message containing your exact shoe model, size, color tone, quantity, price, and shipping details. Simply hit send in WhatsApp on mobile or desktop and our concierge confirms dispatch.',
  },
  {
    id: 'faq-3',
    category: 'Shipping & Returns',
    question: 'How long does shipping take and when is it complimentary?',
    answer:
      'Standard courier delivery arrives in 3–5 business days and is complimentary on all orders above PKR 15,000. Express 1–2 business day air delivery is available at checkout.',
  },
  {
    id: 'faq-4',
    category: 'Shipping & Returns',
    question: 'What is your exchange and return policy?',
    answer:
      'Unworn pairs tried indoors on a carpeted surface may be exchanged for another size or returned within 30 days of delivery in their original dust bag and box.',
  },
  {
    id: 'faq-5',
    category: 'Care & Materials',
    question: 'How should I care for cream leather and taupe suede shoes?',
    answer:
      'For suede pairs, brush gently in one direction with a dry crepe or soft horsehair brush after wear. For smooth alabaster or blush calfskin, wipe with a slightly damp cloth and condition twice a season with neutral balm.',
  },
  {
    id: 'faq-6',
    category: 'WhatsApp Ordering',
    question: 'What payment methods can I use when ordering?',
    answer:
      'You can pay via WhatsApp Concierge payment link, Cash on Delivery (COD), or Card on Delivery depending on your location.',
  },
];

export function FaqPage() {
  usePageMeta({
    title: 'Frequently Asked Questions',
    description: 'Answers regarding Solenne shoe sizing, WhatsApp ordering, complimentary shipping, exchanges, and suede care.',
  });

  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [openId, setOpenId] = useState<string>(FAQS[0].id);

  const categories = ['All', 'Sizing & Fit', 'WhatsApp Ordering', 'Shipping & Returns', 'Care & Materials'];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((item) => {
      if (selectedCat !== 'All' && item.category !== selectedCat) return false;
      if (q && !item.question.toLowerCase().includes(q) && !item.answer.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, selectedCat]);

  return (
    <div className="bg-[#FAF7F2]">
      <section className="border-b border-[#E2D9CE] bg-[#F2ECE3]/75">
        <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#5C4332]">Client Guide</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl font-medium text-[#2B231D]">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#6E6359]">
            Everything you need to know about sizing, leather care, delivery, and ordering via WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6E6359]"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search questions..."
              aria-label="Search FAQs"
              className="h-10 w-full border border-[#DFD4C6] bg-[#FAF7F2] pl-10 pr-4 text-sm text-[#2B231D]"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCat(cat)}
                className={`h-9 px-3 text-xs font-medium transition-colors ${
                  selectedCat === cat
                    ? 'bg-[#2B231D] text-[#FAF7F2]'
                    : 'bg-[#F2ECE3] text-[#6E6359] hover:text-[#2B231D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-[#E2D9CE] border-t border-b border-[#E2D9CE]">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#6E6359]">No questions matched "{query}".</p>
          ) : (
            filtered.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? '' : item.id)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <div>
                      <span className="block text-[11px] font-medium tracking-wider uppercase text-[#5C4332]">
                        {item.category}
                      </span>
                      <span className="mt-1 block text-base font-medium text-[#2B231D]">{item.question}</span>
                    </div>
                    <ChevronDown
                      className={`h-4.5 w-4.5 shrink-0 text-[#6E6359] transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && <p className="pb-5 text-sm leading-relaxed text-[#6E6359]">{item.answer}</p>}
                </div>
              );
            })
          )}
        </div>

        <div className="border border-[#E2D9CE] bg-[#F2ECE3] p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-medium text-[#2B231D]">Still have a sizing question?</h2>
            <p className="mt-1 text-sm text-[#6E6359]">Message our footwear specialists directly on WhatsApp.</p>
          </div>
          <a
            href={buildWhatsAppUrl(buildSupportMessage('FAQ & Sizing Inquiry'))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 shrink-0 items-center gap-2 bg-[#5C4332] px-5 text-xs font-medium tracking-wide text-[#FAF7F2] hover:bg-[#3D2B1F]"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
}
