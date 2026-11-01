import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How does Cash On Delivery (COD) work?',
      a: 'When you choose Cash On Delivery at checkout, you pay nothing upfront. Our courier partner will deliver your parcel to your doorstep, and you hand over the cash amount to the delivery associate upon receiving your sealed package.'
    },
    {
      q: 'What is the delivery timeline for orders within India?',
      a: 'We process all orders from our Delhi/Jaipur ateliers within 24 hours. Metro deliveries (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata) arrive within 2-3 business days. Rest of India typically takes 4-5 business days.'
    },
    {
      q: 'Can I exchange my size if it does not fit perfectly?',
      a: 'Absolutely. We offer a complimentary 7-day doorstep exchange across India. Simply email us at havenclothingindia@gmail.com with your Order Number and desired new size. We arrange a reverse pickup at zero additional cost.'
    },
    {
      q: 'How should I care for my HAVEN heavyweight garments?',
      a: 'All HAVEN combed cotton is pre-shrunk. For maximum longevity, wash on gentle cold cycle (30°C or below), dry flat in shade inside out, and avoid heavy heat tumble drying.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8C8375] font-semibold">
          WE ARE HERE TO HELP
        </p>
        <h1 className="text-3xl sm:text-5xl font-serif text-[#1A1918]">
          Contact HAVEN CLOTHING
        </h1>
        <p className="text-xs sm:text-sm text-[#666055] leading-relaxed">
          Questions about sizing, custom inquiries, or order status? Reach out directly to our founding team.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#F5F2EB] border border-[#E3DDD1] p-6 space-y-3">
          <Mail className="w-6 h-6 text-[#C5A880]" />
          <h3 className="font-serif text-lg text-[#1A1918]">Customer Support</h3>
          <p className="text-xs text-[#6B6458]">For order tracking, exchanges, and general inquiries:</p>
          <a
            href="mailto:havenclothingindia@gmail.com"
            className="text-xs font-semibold text-[#1A1918] hover:text-[#8C6D45] underline block break-all"
          >
            havenclothingindia@gmail.com
          </a>
        </div>

        <div className="bg-[#F5F2EB] border border-[#E3DDD1] p-6 space-y-3">
          <Phone className="w-6 h-6 text-[#C5A880]" />
          <h3 className="font-serif text-lg text-[#1A1918]">WhatsApp &amp; Phone</h3>
          <p className="text-xs text-[#6B6458]">Mon to Sat, 10:00 AM – 7:00 PM IST:</p>
          <p className="text-xs font-semibold text-[#1A1918]">+91 98290 12345 / +91 97110 54321</p>
        </div>

        <div className="bg-[#F5F2EB] border border-[#E3DDD1] p-6 space-y-3">
          <MapPin className="w-6 h-6 text-[#C5A880]" />
          <h3 className="font-serif text-lg text-[#1A1918]">Design &amp; Atelier</h3>
          <p className="text-xs text-[#6B6458]">Flagship Design Studio &amp; Dispatch Hub:</p>
          <p className="text-xs font-semibold text-[#1A1918]">Civil Lines, Jaipur &amp; South Extension, New Delhi, India</p>
        </div>
      </div>

      {/* Form + FAQ Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left: Contact Form */}
        <div className="lg:col-span-6 bg-[#FAF9F5] border border-[#E3DDCF] p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-serif text-[#1A1918]">Send Us a Message</h2>
            <p className="text-xs text-[#736C61] mt-1">We typically reply within 2–4 hours during business days.</p>
          </div>

          {submitted ? (
            <div className="p-6 bg-[#EBF2EC] border border-[#D5E5D8] text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-[#3B6E47] mx-auto" />
              <h3 className="font-serif text-lg text-[#1A1918]">Message Sent Successfully</h3>
              <p className="text-xs text-[#4F6854] leading-relaxed">
                Thank you for contacting HAVEN. A member of our team will reply to <strong>{email}</strong> shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs uppercase tracking-wider text-[#1A1918] underline font-semibold pt-2"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-[#544E45] font-semibold">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Garvit Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-[#544E45] font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-wider text-[#544E45] font-semibold">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider text-[#544E45] font-semibold">Message or Inquiry</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you with HAVEN pieces?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#DDD5C6] focus:outline-none focus:border-[#1A1918]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#1A1918] hover:bg-[#33312E] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4 text-[#C5A880]" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>

        {/* Right: Frequent Inquiries Accordion */}
        <div className="lg:col-span-6 space-y-4">
          <div className="pb-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C8375] font-semibold">
              QUICK ANSWERS
            </span>
            <h2 className="text-2xl font-serif text-[#1A1918]">Frequently Asked Questions</h2>
          </div>

          <div className="divide-y divide-[#E3DDD1] border-y border-[#E3DDD1]">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4"
                >
                  <h4 className="text-sm font-serif font-medium text-[#1A1918]">{faq.q}</h4>
                  {activeFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-[#8C8375] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8C8375] shrink-0" />
                  )}
                </button>
                {activeFaq === idx && (
                  <p className="mt-2 text-xs text-[#666055] leading-relaxed animate-in fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="bg-[#F5F2EB] p-4 border border-[#E3DDD1] text-xs text-[#6E675D]">
            <p>
              Founders: <strong>Garvit Sharma &amp; Ankit Meena</strong>. Direct official communications: 
              <a href="mailto:havenclothingindia@gmail.com" className="text-[#8C6D45] underline font-medium ml-1">
                havenclothingindia@gmail.com
              </a>
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
