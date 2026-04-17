"use client";

import { Edit2 } from "lucide-react";
import { useAdmin } from "../admin-context";

export function ProfileScreen() {
  const {
    t,
    adminProfile,
    isEditingProfile,
    setIsEditingProfile,
    handleChangePassword,
  } = useAdmin();

  return (
    <div>
      <h1 className="text-3xl text-foreground mb-8">{t.profile}</h1>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {!isEditingProfile ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-foreground mb-2">Email</label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  {adminProfile.email}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm text-foreground">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(true)}
                    className="text-primary text-sm hover:underline flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    {t.edit}
                  </button>
                </div>
                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
                  ••••••••
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 italic">{t.viewOnly}</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-6">
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
                  {t.save}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 border border-gray-300 text-foreground py-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
