"use client";

import { useEffect } from "react";
import { Plus, Edit2, Trash2, Star } from "lucide-react";
import { useAdmin } from "../admin-context";
import { loadAdminReviews } from "../loaders";

export function RatingsScreen() {
  const {
    t,
    isRTL,
    reviews,
    handleAddReview,
    handleEditReview,
    handleDeleteReview,
    setReviews,
  } = useAdmin();

  useEffect(() => {
    let cancelled = false;
    loadAdminReviews()
      .then((list) => {
        if (!cancelled) setReviews(list);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          alert(err instanceof Error ? err.message : "Failed to load reviews");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [setReviews]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl text-foreground">{t.ratings}</h1>
        <button
          type="button"
          onClick={handleAddReview}
          className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5" />
          {t.addReview}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-foreground">{t.reviews}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm font-semibold text-foreground`}>
                  ID
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm font-semibold text-foreground`}>
                  {t.customerName}
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm font-semibold text-foreground`}>
                  {t.reviewContextEn}
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm font-semibold text-foreground`}>
                  {t.reviewContextAr}
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm font-semibold text-foreground`}>
                  {t.rating}
                </th>
                <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-4 text-sm font-semibold text-foreground`}>
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id} className="border-b border-gray-100">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">{review.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{review.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-[14rem] truncate">{review.contextEn}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-[14rem] truncate" dir="rtl">
                    {review.contextAr}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-accent">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditReview(review)}
                        className="p-2 text-primary hover:bg-secondary rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteReview(review.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
