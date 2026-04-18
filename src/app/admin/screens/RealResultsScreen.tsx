"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRealResult,
  updateRealResult,
  deleteRealResult,
  fetchRealResults,
  type RealResultRow,
} from "@/lib/api";
import { useAdmin } from "../admin-context";
import { loadAdminProducts } from "../loaders";

const REAL_RESULTS_KEY = ["realResults"] as const;

export function RealResultsScreen() {
  const { t, products, setProducts } = useAdmin();
  const queryClient = useQueryClient();

  useEffect(() => {
    let cancelled = false;
    loadAdminProducts()
      .then((list) => {
        if (!cancelled) setProducts(list);
      })
      .catch((err) => {
        if (!cancelled) console.error(err);
      });
    return () => {
      cancelled = true;
    };
  }, [setProducts]);

  const defaultProducts = useMemo(() => products.filter((p) => p.productType === "default"), [products]);

  const { data: rows = [], isLoading, isError, error } = useQuery({
    queryKey: REAL_RESULTS_KEY,
    queryFn: fetchRealResults,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: REAL_RESULTS_KEY });
    queryClient.invalidateQueries({ queryKey: ["store", "real-results"] });
  };

  const [newProductId, setNewProductId] = useState("");
  const newFileRef = useRef<HTMLInputElement>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftProductId, setDraftProductId] = useState("");
  const editFileRef = useRef<HTMLInputElement>(null);

  const createMut = useMutation({
    mutationFn: (fd: FormData) => createRealResult(fd),
    onSuccess: () => {
      setNewProductId("");
      if (newFileRef.current) newFileRef.current.value = "";
      invalidate();
    },
    onError: (e: Error) => alert(e.message),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, fd }: { id: string; fd: FormData }) => updateRealResult(id, fd),
    onSuccess: () => {
      setEditingId(null);
      invalidate();
    },
    onError: (e: Error) => alert(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: deleteRealResult,
    onSuccess: () => invalidate(),
    onError: (e: Error) => alert(e.message),
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const file = newFileRef.current?.files?.[0];
    if (!file || !newProductId.trim()) {
      alert(t.fillAllFields);
      return;
    }
    const fd = new FormData();
    fd.append("image", file);
    fd.append("productId", newProductId.trim());
    createMut.mutate(fd);
  };

  const startEdit = (r: RealResultRow) => {
    setEditingId(String(r._id));
    setDraftProductId(String(r.productId));
    if (editFileRef.current) editFileRef.current.value = "";
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!draftProductId.trim()) {
      alert(t.fillAllFields);
      return;
    }
    const fd = new FormData();
    fd.append("productId", draftProductId.trim());
    const file = editFileRef.current?.files?.[0];
    if (file) fd.append("image", file);
    updateMut.mutate({ id: editingId, fd });
  };

  const productLabel = (id: string) => {
    const p = defaultProducts.find((x) => x.id === id);
    if (!p) return id;
    return `${p.nameEn} / ${p.nameAr}`;
  };

  return (
    <div>
      <h1 className="text-3xl text-foreground mb-2">{t.realResults}</h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-3xl">{t.realResultsHelp}</p>

      {isError && (
        <p className="text-destructive text-sm mb-4" role="alert">
          {error instanceof Error ? error.message : "Failed to load"}
        </p>
      )}

      <form onSubmit={handleAdd} className="bg-card border border-border rounded-xl p-6 mb-8 max-w-5xl">
        <h2 className="text-lg font-semibold text-foreground mb-4">{t.addRealResult}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t.realResultImage}</label>
            <input
              ref={newFileRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="w-full text-sm text-foreground"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">{t.selectProduct}</label>
            <select
              value={newProductId}
              onChange={(e) => setNewProductId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
              required
            >
              <option value="">{t.selectProductPlaceholder}</option>
              {defaultProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameEn} — {p.nameAr}
                </option>
              ))}
            </select>
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
                <th className="text-start px-4 py-3 font-semibold text-foreground w-24">{t.image}</th>
                <th className="text-start px-4 py-3 font-semibold text-foreground">{t.selectProduct}</th>
                <th className="text-end px-4 py-3 font-semibold text-foreground w-44">{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    {t.loadingDashboard}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    {t.noRealResultsYet}
                  </td>
                </tr>
              ) : (
                rows.map((r) => {
                  const id = String(r._id);
                  const isEdit = editingId === id;
                  return (
                    <tr key={id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 align-top">
                        {isEdit ? (
                          <div className="space-y-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={r.imageUrl}
                              alt=""
                              className="w-20 h-14 object-cover rounded border border-border"
                            />
                            <input
                              ref={editFileRef}
                              type="file"
                              accept="image/png,image/jpeg,image/jpg"
                              className="w-full text-xs"
                            />
                          </div>
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.imageUrl}
                            alt=""
                            className="w-20 h-14 object-cover rounded border border-border"
                          />
                        )}
                      </td>
                      <td className="px-4 py-3 align-top">
                        {isEdit ? (
                          <select
                            value={draftProductId}
                            onChange={(e) => setDraftProductId(e.target.value)}
                            className="w-full min-w-[180px] px-2 py-1.5 rounded border border-input bg-background text-sm"
                          >
                            {defaultProducts.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.nameEn} — {p.nameAr}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-foreground">{productLabel(String(r.productId))}</span>
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
                                if (confirm(t.deleteRealResultConfirm)) deleteMut.mutate(id);
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
