"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/contexts/LanguageContext";
import { submitContactMessage } from "@/lib/api";
import { LAMORQ_CONTACT } from "@/lib/contact-info";
import PageHeader from "@/components/PageHeader";
import ScrollReveal from "@/components/ScrollReveal";
import { SocialIconLinks } from "@/components/SocialIconLinks";

const Contact = () => {
  const { t, lang } = useLang();
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

  const contactRows = [
    {
      icon: Mail,
      label: t("Email", "البريد الإلكتروني"),
      value: LAMORQ_CONTACT.email,
      href: `mailto:${LAMORQ_CONTACT.email}`,
    },
    {
      icon: Phone,
      label: t("Phone", "الهاتف"),
      value: LAMORQ_CONTACT.phoneDisplay,
      href: LAMORQ_CONTACT.phoneHref,
    },
    {
      icon: MapPin,
      label: t("Location", "الموقع"),
      value: t("Cairo — New Giza, Egypt", "القاهرة — نيو جيزة، مصر"),
      href: null as string | null,
    },
    {
      icon: Clock,
      label: t("Working hours", "ساعات العمل"),
      value: t("Sun–Thu, 9:00 AM – 6:00 PM (EET)", "الأحد–الخميس، 9 ص – 6 م (بتوقيت القاهرة)"),
      href: null as string | null,
    },
  ];

  return (
    <div className="bg-background">
      <PageHeader
        title={t("Contact & Support", "تواصل معنا")}
        subtitle={t(
          "Questions about an order or a product? We are happy to help — by message, email, phone, or social.",
          "عندك سؤال عن طلب أو منتج؟ نسعد نساعدك — بالرسالة، البريد، الهاتف، أو السوشيال."
        )}
      />

      <div className="container mx-auto px-page pb-20 md:pb-28 max-w-6xl">
        <div className="rounded-2xl border border-border/80 bg-muted/25 p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left — contact + social */}
            <ScrollReveal direction="left" className="lg:col-span-5">
              <div className="flex flex-col gap-8">
                <div>
                  <div className="flex items-center gap-2.5 mb-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <MessageSquare className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                      {t("Get in touch", "تواصل معنا")}
                    </h2>
                  </div>

                  <ul className="space-y-3">
                    {contactRows.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/25"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <item.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                            {item.label}
                          </p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="mt-1 block text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="mt-1 text-sm font-medium text-foreground leading-relaxed">{item.value}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    {t("Follow LAMORQ", "تابعي لاموركيو")}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {t(
                      "Tips, new drops, and behind the scenes — find us on Facebook, Instagram, and TikTok.",
                      "نصائح، إصدارات جديدة، ولمحات من وراء الكواليس — تابعينا على فيسبوك وإنستغرام وتيك توك."
                    )}
                  </p>
                  <SocialIconLinks variant="contact" />
                </div>
              </div>
            </ScrollReveal>

            {/* Right — form */}
            <ScrollReveal direction="right" className="lg:col-span-7">
              <div className="rounded-xl border border-border bg-background p-6 sm:p-8 shadow-sm h-full flex flex-col">
                <h2 className="font-display text-xl font-bold text-foreground mb-1">
                  {t("Send a message", "أرسلي رسالة")}
                </h2>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  {t(
                    "Fill in the form and we will reply as soon as we can.",
                    "املئي النموذج وسنرد في أقرب وقت."
                  )}
                </p>

                <form className="space-y-4 flex-1 flex flex-col" onSubmit={handleSubmit} noValidate>
                  <div>
                    <label htmlFor="contact-name" className="text-sm font-medium text-foreground mb-1.5 block">
                      {t("Full name", "الاسم الكامل")}
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("Your name", "اسمك")}
                      className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/40"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className="text-sm font-medium text-foreground mb-1.5 block">
                      {t("Phone number", "رقم الهاتف")}
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t("For example, 01xxxxxxxxx", "مثال: 01xxxxxxxxx")}
                      className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/40"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-subject" className="text-sm font-medium text-foreground mb-1.5 block">
                      {t("Subject", "الموضوع")}
                    </label>
                    <select
                      id="contact-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/40"
                    >
                      <option value="">{t("Select a subject", "اختر موضوعاً")}</option>
                      <option value="order">{t("Order inquiry", "استفسار عن طلب")}</option>
                      <option value="product">{t("Product question", "سؤال عن منتج")}</option>
                      <option value="return">{t("Return or exchange", "إرجاع أو استبدال")}</option>
                      <option value="other">{t("Other", "أخرى")}</option>
                    </select>
                  </div>

                  <div className="flex-1 flex flex-col min-h-0">
                    <label htmlFor="contact-message" className="text-sm font-medium text-foreground mb-1.5 block">
                      {t("Message", "الرسالة")}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t("How can we help?", "كيف نقدر نساعدك؟")}
                      className="flex min-h-[140px] w-full flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/40 resize-y"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={sending}
                    className="gradient-brand text-primary-foreground hover:opacity-90 w-full h-11 mt-2 disabled:opacity-60 gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {sending ? t("Sending…", "جاري الإرسال…") : t("Send message", "إرسال الرسالة")}
                  </Button>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
