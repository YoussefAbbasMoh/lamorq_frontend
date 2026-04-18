"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBannerOffers,
  createBannerOffer,
  updateBannerOffer,
  deleteBannerOffer,
  type BannerOffer,
} from "@/lib/api";
import { useAdmin } from "../admin-context";

const BANNER_OFFERS_KEY = ["bannerOffers"] as const;

export function OffersBannerScreen() {
  const { t } = useAdmin();
  const queryClient = useQueryClient();

  const { data: offers = [], isLoading, isError, error } = useQuery({
    queryKey: BANNER_OFFERS_KEY,
    queryFn: fetchBannerOffers,
  });

  const [newRow, setNewRow] = useState({ offerEN: "", offerAR: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ offerEN: "", offerAR: "" });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: BANNER_OFFERS_KEY });

  const createMut = useMutation({
    mutationFn: (payload: { offerEN: string; offerAR: string }) => createBannerOffer(payload),
    onSuccess: () => {
      setNewRow({ offerEN: "", offerAR: "" });
      invalidate();
    },
    onError: (e: Error) => alert(e.message),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { offerEN: string; offerAR: string } }) =>
      updateBannerOffer(id, body),
    onSuccess: () => {
      setEditingId(null);
      invalidate();
    },
    onError: (e: Error) => alert(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: deleteBannerOffer,
    onSuccess: () => invalidate(),
    onError: (e: Error) => alert(e.message),
  });

  const startEdit = (o: BannerOffer) => {
    setEditingId(String(o._id));
    setDraft({ offerEN: o.offerEN, offerAR: o.offerAR });
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!draft.offerEN.trim() || !draft.offerAR.trim()) {
      alert(t.fillAllFields);
      return;
    }
    updateMut.mutate({
      id: editingId,
      body: { offerEN: draft.offerEN.trim(), offerAR: draft.offerAR.trim() },
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRow.offerEN.trim() || !newRow.offerAR.trim()) {
      alert(t.fillAllFields);
      return;
    }
    createMut.mutate({
      offerEN: newRow.offerEN.trim(),
      offerAR: newRow.offerAR.trim(),
    });
  };

  return (
    <div>
      <h1 className="text-3xl text-foreground mb-2">{t.offersBanner}</h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-3xl">{t.offersBannerHelp}</p>

      {isError && (
        <p className="text-destructive text-sm mb-4" role="alert">
          {error instanceof Error ? error.message : "Failed to load"}
        </p>
      )}

      <form onSubmit={handleAdd} className="bg-card border border-border rounded-xl p-6 mb-8 max-w-5xl">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t.addOfferLine}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t.offerEnLabel}</label>
            <input
              value={newRow.offerEN}
              onChange={(e) => setNewRow((p) => ({ ...p, offerEN: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
              placeholder="Nationwide delivery — …"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t.offerArLabel}</label>
            <input
              value={newRow.offerAR}
              onChange={(e) => setNewRow((p) => ({ ...p, offerAR: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
              dir="rtl"
              placeholder="توصيل لجميع المحافظات — …"
            />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={createMut.isPending}
              className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {t.addRowButton}
            </button>
          </div>
        </div>
      </form>

      <div className="bg-card border border-border rounded-xl overflow-hidden max-w-5xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-start px-4 py-3 font-semibold text-foreground">{t.offerEnLabel}</th>
                <th className="text-start px-4 py-3 font-semibold text-foreground">{t.offerArLabel}</th>
                <th className="text-end px-4 py-3 font-semibold text-foreground w-40">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    {t.loadingDashboard}
                  </td>
                </tr>
              ) : offers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    {t.noOffersYet}
                  </td>
                </tr>
              ) : (
                offers.map((o) => {
                  const id = String(o._id);
                  const isEdit = editingId === id;
                  return (
                    <tr key={id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 align-top">
                        {isEdit ? (
                          <input
                            value={draft.offerEN}
                            onChange={(e) => setDraft((d) => ({ ...d, offerEN: e.target.value }))}
                            className="w-full min-w-[160px] px-2 py-1.5 rounded border border-input bg-background"
                          />
                        ) : (
                          <span className="text-foreground">{o.offerEN}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {isEdit ? (
                          <input
                            value={draft.offerAR}
                            onChange={(e) => setDraft((d) => ({ ...d, offerAR: e.target.value }))}
                            className="w-full min-w-[160px] px-2 py-1.5 rounded border border-input bg-background"
                            dir="rtl"
                          />
                        ) : (
                          <span className="text-foreground" dir="rtl">
                            {o.offerAR}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-end align-top whitespace-nowrap">
                        {isEdit ? (
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={saveEdit}
                              disabled={updateMut.isPending}
                              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 disabled:opacity-50"
                            >
                              {t.save}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted"
                            >
                              {t.cancel}
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(o)}
                              className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted"
                            >
                              {t.edit}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(t.deleteOfferConfirm)) deleteMut.mutate(id);
                              }}
                              disabled={deleteMut.isPending}
                              className="px-3 py-1.5 rounded-lg border border-destructive/40 text-destructive text-xs font-medium hover:bg-destructive/10 disabled:opacity-50"
                            >
                              {t.delete}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
