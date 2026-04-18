"use client";

import { useLang } from "@/contexts/LanguageContext";
import PageHeader from "@/components/PageHeader";

const Privacy = () => {
  const { t } = useLang();
  return (
    <div>
      <PageHeader title={t("Privacy Policy", "سياسة الخصوصية")} />
      <div className="container mx-auto px-page py-16 max-w-3xl">
        <div className="space-y-8 text-muted-foreground text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-foreground">{t("Information We Collect", "المعلومات التي نجمعها")}</h2>
            <p>{t("We collect personal information you provide during checkout (name, phone, address, email) solely for order processing and delivery.", "نجمع المعلومات الشخصية التي تقدمها أثناء الدفع (الاسم والهاتف والعنوان والبريد الإلكتروني) فقط لمعالجة الطلبات والتوصيل.")}</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-foreground">{t("How We Use Your Data", "كيف نستخدم بياناتك")}</h2>
            <p>{t("Your data is used to process orders, send order confirmations, and improve our services. We never sell or share your data with third parties for marketing.", "تُستخدم بياناتك لمعالجة الطلبات وإرسال تأكيدات الطلبات وتحسين خدماتنا.")}</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-foreground">{t("Data Security", "أمان البيانات")}</h2>
            <p>{t("We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or destruction.", "نطبق إجراءات أمان مناسبة لحماية معلوماتك الشخصية ضد الوصول غير المصرح به.")}</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-foreground">{t("Contact", "تواصل")}</h2>
            <p>{t("For privacy concerns, contact us at info@lamorq.com", "لأي مخاوف تتعلق بالخصوصية، تواصل معنا على info@lamorq.com")}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
