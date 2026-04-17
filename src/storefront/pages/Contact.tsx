"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LanguageContext";
import { submitContactMessage } from "@/lib/api";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";

const Contact = () => {
  const { t, isAr, lang } = useLang();
  const [formData, setFormData] = useState({ name: "", phone: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resolveSubject = (key: string) => {
    const map: Record<string, string> = {
      order: t("Order Inquiry", "استفسار عن طلب"),
      product: t("Product Question", "سؤال عن منتج"),
      return: t("Return / Exchange", "إرجاع / استبدال"),
      other: t("Other", "أخرى"),
    };
    return map[key] || key;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = formData.name.trim();
    const phoneNumber = formData.phone.trim();
    const subjectKey = formData.subject.trim();
    const message = formData.message.trim();

    if (!fullName || !phoneNumber || !subjectKey || !message) {
      toast.error(t("Please fill in all fields.", "يرجى تعبئة جميع الحقول."));
      return;
    }

    setSending(true);
    try {
      const res = await submitContactMessage({
        fullName,
        phoneNumber,
        subject: resolveSubject(subjectKey),
        message,
      });
      const ok = lang === "ar" ? res.message.ar : res.message.en;
      toast.success(ok);
      setFormData({ name: "", phone: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("Something went wrong.", "حدث خطأ ما."));
    } finally {
      setSending(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: t("Email Support", "الدعم بالبريد"), value: "hello@lamorq.com" },
    { icon: Phone, label: t("Call Center", "مركز الاتصال"), value: "+20 100 123 4567" },
    { icon: MapPin, label: t("Main Headquarters", "المقر الرئيسي"), value: t("Cairo, New Giza, Egypt", "القاهرة، نيو جيزة، مصر") },
    { icon: Clock, label: t("Working Hours", "ساعات العمل"), value: t("9:00 AM - 6:00 PM", "9:00 ص - 6:00 م") },
  ];

  return (
    <div>
      <PageHeader
        title={t("Contact & Support", "تواصل معنا")}
        subtitle={t("We're here to help. Reach out anytime.", "نحن هنا للمساعدة. تواصل معنا في أي وقت.")}
      />

      <div className="container mx-auto px-4 py-16 md:py-20 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left Column - Contact Info + Social */}
          <ScrollReveal direction="left">
            <div className="flex flex-col gap-8 h-full">
              {/* Contact Details */}
              <div>
                <div className="flex items-center gap-2.5 mb-6">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                    {t("Contact Details", "تفاصيل التواصل")}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contactInfo.map((item, i) => (
                    <div key={i} className="rounded-xl bg-primary/[0.06] p-5 flex flex-col gap-4">
                      <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.15em] text-primary font-medium mb-1.5">{item.label}</p>
                        <p className="text-sm font-semibold text-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow Our Journey */}
              <div className="rounded-xl border border-border p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {t("Follow Our Journey", "تابع رحلتنا")}
                </h3>
                <p className="text-sm text-muted-foreground mb-5">
                  {t(
                    "Stay connected with us on social media for tips, new products, and exclusive offers.",
                    "ابق على تواصل معنا عبر وسائل التواصل الاجتماعي لنصائح ومنتجات جديدة وعروض حصرية."
                  )}
                </p>
                <div className="flex gap-3">
                  {[
                    { label: "Facebook", href: "https://facebook.com", icon: (
                      <FacebookIcon className="w-4 h-4" />
                    )},
                    { label: "Instagram", href: "https://instagram.com", icon: (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                    )},
                    { label: "TikTok", href: "https://tiktok.com", icon: (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48V13a8.28 8.28 0 005.58 2.15V11.7a4.83 4.83 0 01-3.77-1.24V6.69h3.77z"/></svg>
                    )},
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-primary-foreground text-sm font-medium gradient-brand hover:opacity-90 transition-opacity"
                    >
                      {social.icon}
                      {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column - Send a Message Form */}
          <ScrollReveal direction="right" className="h-full">
            <div className="rounded-xl border border-border p-8 bg-background h-full flex flex-col">
              <h2 className="font-display text-xl font-bold text-foreground mb-1">
                {t("Send a Message", "أرسل رسالة")}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {t("Fill in the form and we'll get back to you shortly.", "املأ النموذج وسنتواصل معك قريباً.")}
              </p>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    {t("Full Name", "الاسم الكامل")}
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("Enter your name", "أدخل اسمك")}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    {t("Phone Number", "رقم الهاتف")}
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("Enter your phone number", "أدخل رقم هاتفك")}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    {t("Subject", "الموضوع")}
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">{t("Select a subject", "اختر موضوعاً")}</option>
                    <option value="order">{t("Order Inquiry", "استفسار عن طلب")}</option>
                    <option value="product">{t("Product Question", "سؤال عن منتج")}</option>
                    <option value="return">{t("Return / Exchange", "إرجاع / استبدال")}</option>
                    <option value="other">{t("Other", "أخرى")}</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">
                    {t("Message", "الرسالة")}
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t("Write your message here...", "اكتب رسالتك هنا...")}
                    className="flex min-h-[120px] w-full rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="gradient-brand text-primary-foreground hover:opacity-90 w-full h-11 mt-2 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  {sending ? t("Sending…", "جاري الإرسال…") : t("Send Message", "إرسال الرسالة")}
                </Button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default Contact;
