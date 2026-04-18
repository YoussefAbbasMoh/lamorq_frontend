"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchShippingRegions,
  createShippingRegion,
  updateShippingRegion,
  deleteShippingRegion,
  type ShippingRegion,
} from "@/lib/api";
import { useAdmin } from "../admin-context";

export function RegionPricesScreen() {
  const { t } = useAdmin();
  const queryClient = useQueryClient();

  const { data: regions = [], isLoading, isError, error } = useQuery({
    queryKey: ["shippingRegions"],
    queryFn: fetchShippingRegions,
  });

  const [newRow, setNewRow] = useState({ government_en: "", government_ar: "", price: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ government_en: "", government_ar: "", price: "" });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["shippingRegions"] });

  const createMut = useMutation({
    mutationFn: (payload: { government_en: string; government_ar: string; price: number }) =>
      createShippingRegion(payload),
    onSuccess: () => {
      setNewRow({ government_en: "", government_ar: "", price: "" });
      invalidate();
    },
    onError: (e: Error) => alert(e.message),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { government_en: string; government_ar: string; price: number } }) =>
      updateShippingRegion(id, body),
    onSuccess: () => {
      setEditingId(null);
      invalidate();
    },
    onError: (e: Error) => alert(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: deleteShippingRegion,
    onSuccess: () => invalidate(),
    onError: (e: Error) => alert(e.message),
  });

  const startEdit = (r: ShippingRegion) => {
    setEditingId(String(r._id));
    setDraft({
      government_en: r.government_en,
      government_ar: r.government_ar,
      price: String(r.price),
    });
  };

  const saveEdit = () => {
    if (!editingId) return;
    const price = Number(draft.price);
    if (!draft.government_en.trim() || !draft.government_ar.trim() || Number.isNaN(price) || price < 0) {
      alert(t.fillAllFields);
      return;
    }
    updateMut.mutate({
      id: editingId,
      body: {
        government_en: draft.government_en.trim(),
        government_ar: draft.government_ar.trim(),
        price,
      },
    });
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(newRow.price);
    if (!newRow.government_en.trim() || !newRow.government_ar.trim() || Number.isNaN(price) || price < 0) {
      alert(t.fillAllFields);
      return;
    }
    createMut.mutate({
      government_en: newRow.government_en.trim(),
      government_ar: newRow.government_ar.trim(),
      price,
    });
  };

  return (
    <div>
      <h1 className="text-3xl text-foreground mb-2">{t.regionPrices}</h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-3xl">{t.regionPricesHelp}</p>

      {isError && (
        <p className="text-destructive text-sm mb-4" role="alert">
          {error instanceof Error ? error.message : "Failed to load"}
        </p>
      )}

      <form onSubmit={handleAdd} className="bg-card border border-border rounded-xl p-6 mb-8 max-w-5xl">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t.addRegion}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t.governorateEn}</label>
            <input
              value={newRow.government_en}
              onChange={(e) => setNewRow((p) => ({ ...p, government_en: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
              placeholder="Cairo"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t.governorateAr}</label>
            <input
              value={newRow.government_ar}
              onChange={(e) => setNewRow((p) => ({ ...p, government_ar: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
              dir="rtl"
              placeholder="القاهرة"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-1.5">{t.shippingFee}</label>
              <input
                type="number"
                min={0}
                step={1}
                value={newRow.price}
                onChange={(e) => setNewRow((p) => ({ ...p, price: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
                placeholder="50"
              />
            </div>
            <button
              type="submit"
              disabled={createMut.isPending}
              className="self-end px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
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
                <th className="text-start px-4 py-3 font-semibold text-foreground">{t.governorateEn}</th>
                <th className="text-start px-4 py-3 font-semibold text-foreground">{t.governorateAr}</th>
                <th className="text-start px-4 py-3 font-semibold text-foreground">{t.shippingFee}</th>
                <th className="text-end px-4 py-3 font-semibold text-foreground w-40">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    {t.loadingDashboard}
                  </td>
                </tr>
              ) : regions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    {t.noRegionsYet}
                  </td>
                </tr>
              ) : (
                regions.map((r) => {
                  const id = String(r._id);
                  const isEdit = editingId === id;
                  return (
                    <tr key={id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 align-top">
                        {isEdit ? (
                          <input
                            value={draft.government_en}
                            onChange={(e) => setDraft((d) => ({ ...d, government_en: e.target.value }))}
                            className="w-full min-w-[120px] px-2 py-1.5 rounded border border-input bg-background"
                          />
                        ) : (
                          <span className="text-foreground">{r.government_en}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {isEdit ? (
                          <input
                            value={draft.government_ar}
                            onChange={(e) => setDraft((d) => ({ ...d, government_ar: e.target.value }))}
                            className="w-full min-w-[120px] px-2 py-1.5 rounded border border-input bg-background"
                            dir="rtl"
                          />
                        ) : (
                          <span className="text-foreground" dir="rtl">
                            {r.government_ar}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {isEdit ? (
                          <input
                            type="number"
                            min={0}
                            value={draft.price}
                            onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                            className="w-24 px-2 py-1.5 rounded border border-input bg-background"
                          />
                        ) : (
                          <span className="text-foreground">
                            {r.price} {t.egp}
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
                              onClick={() => startEdit(r)}
                              className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted"
                            >
                              {t.edit}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(t.deleteRegionConfirm)) deleteMut.mutate(id);
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
