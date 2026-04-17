"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, Eye, EyeOff } from "lucide-react";
import * as api from "@/lib/api";
import { adminTranslations } from "@/app/admin/i18n";
import type { Language } from "@/app/admin/types";

export function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    if (api.getStoredToken()) router.replace("/admin/dashboard");
  }, [router]);
  const [language, setLanguage] = useState<Language>("en");
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const t = adminTranslations[language];
  const isRTL = language === "ar";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const token = await api.adminLogin(loginEmail, loginPassword);
      api.setStoredToken(token);
      router.replace("/admin/dashboard");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password changed successfully!");
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-secondary to-white flex items-center justify-center p-4 ${isRTL ? "rtl" : "ltr"}`}
    >
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm">{language === "en" ? "العربية" : "English"}</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">L</span>
            </div>
            <h1 className="text-2xl text-foreground mb-2">LAMORQ Admin</h1>
            <p className="text-gray-600 text-sm">{t.login}</p>
          </div>

          {!showChangePassword ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-foreground mb-2">{t.email}</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="admin@lamorq.com"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">{t.password}</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {loginLoading ? "…" : t.login}
              </button>

              <button
                type="button"
                onClick={() => setShowChangePassword(true)}
                className="w-full text-primary text-sm hover:underline"
              >
                {t.changePassword}
              </button>
            </form>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm text-foreground mb-2">{t.oldPassword}</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">{t.newPassword}</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm text-foreground mb-2">{t.confirmPassword}</label>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  {t.submit}
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="flex-1 border border-gray-300 text-foreground py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-primary text-sm hover:underline">
            ← {language === "en" ? "Back to Website" : "العودة للموقع"}
          </Link>
        </div>
      </div>
    </div>
  );
}
