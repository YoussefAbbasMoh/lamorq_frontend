"use client";

import { useLang } from "@/contexts/LanguageContext";
import PageHeader from "@/components/PageHeader";

const Terms = () => {
  const { t } = useLang();
  return (
    <div>
      <PageHeader title={t("Terms & Conditions", "الشروط والأحكام")} />
      <div className="container mx-auto px-4 py-16 max-w-3xl prose prose-green">
        <div className="space-y-8 text-muted-foreground text-sm leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-foreground">{t("1. General", "1. عام")}</h2>
            <p>{t("By accessing and using the LAMORQ website, you agree to be bound by these terms and conditions. All products sold are for personal use only.", "بالدخول إلى موقع لاموركيو واستخدامه، فإنك توافق على الالتزام بهذه الشروط والأحكام.")}</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-foreground">{t("2. Products", "2. المنتجات")}</h2>
            <p>{t("All products are 100% natural. While we strive for accuracy in product descriptions, slight variations may occur. Products are not intended to diagnose, treat, or cure any medical condition.", "جميع المنتجات طبيعية 100%. بينما نسعى للدقة في وصف المنتجات، قد تحدث اختلافات طفيفة.")}</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-foreground">{t("3. Orders & Payment", "3. الطلبات والدفع")}</h2>
            <p>{t("Orders are confirmed upon payment or selection of Cash on Delivery. We reserve the right to cancel orders due to stock unavailability.", "يتم تأكيد الطلبات عند الدفع أو اختيار الدفع عند الاستلام.")}</p>
          </section>
          <section>
            <h2 className="font-display text-xl font-bold text-foreground">{t("4. Shipping & Returns", "4. الشحن والإرجاع")}</h2>
            <p>{t("Delivery within Egypt takes 2-4 business days. Free shipping on orders above 500 EGP. Returns accepted within 14 days for unopened products.", "التوصيل داخل مصر يستغرق 2-4 أيام عمل. شحن مجاني للطلبات فوق 500 جنيه.")}</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
