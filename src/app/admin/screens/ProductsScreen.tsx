"use client";

import { useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useAdmin } from "../admin-context";
import { loadAdminProducts } from "../loaders";

export function ProductsScreen() {
  const {
    t,
    isRTL,
    products,
    searchQuery,
    setSearchQuery,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    setProducts,
  } = useAdmin();

  useEffect(() => {
    let cancelled = false;
    loadAdminProducts()
      .then((list) => {
        if (!cancelled) setProducts(list);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          alert(err instanceof Error ? err.message : "Failed to load products");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [setProducts]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl text-foreground">{t.products}</h1>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring w-full sm:w-64"
          />
          <button
            type="button"
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            {t.addProduct}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl text-foreground mb-4">Products</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-3 text-sm text-gray-600`}>
                    Image
                  </th>
                  <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-3 text-sm text-gray-600`}>
                    Name (EN)
                  </th>
                  <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-3 text-sm text-gray-600`}>
                    Name (AR)
                  </th>
                  <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-3 text-sm text-gray-600`}>
                    Category
                  </th>
                  <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-3 text-sm text-gray-600`}>
                    Price
                  </th>
                  <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-3 text-sm text-gray-600`}>
                    Rating
                  </th>
                  <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-3 text-sm text-gray-600`}>
                    Featured
                  </th>
                  <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-3 text-sm text-gray-600`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter(
                    (p) =>
                      p.productType === "default" &&
                      (searchQuery === "" ||
                        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.nameAr.includes(searchQuery))
                  )
                  .map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <img
                          src={product.image}
                          alt={product.nameEn}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground">{product.nameEn}</td>
                      <td className="px-6 py-3 text-sm text-foreground" dir="rtl">
                        {product.nameAr}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-3">
                        <p className="text-sm text-primary font-semibold">{product.price} EGP</p>
                        {product.discountPrice && (
                          <p className="text-xs text-gray-400 line-through">{product.discountPrice} EGP</p>
                        )}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">
                        {product.rating} ⭐ ({product.ratingCount})
                      </td>
                      <td className="px-6 py-3">
                        {product.isFeatured && (
                          <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                            ★
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(product)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id, product.productType)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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

      <div>
        <h2 className="text-xl text-foreground mb-4">Upcoming Products</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-3 text-sm text-gray-600`}>
                    Image
                  </th>
                  <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-3 text-sm text-gray-600`}>
                    Name (EN)
                  </th>
                  <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-3 text-sm text-gray-600`}>
                    Name (AR)
                  </th>
                  <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-3 text-sm text-gray-600`}>
                    Category
                  </th>
                  <th className={`${isRTL ? "text-right" : "text-left"} px-6 py-3 text-sm text-gray-600`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter(
                    (p) =>
                      p.productType === "upcoming" &&
                      (searchQuery === "" ||
                        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.nameAr.includes(searchQuery))
                  )
                  .map((product) => (
                    <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <img
                          src={product.image}
                          alt={product.nameEn}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground">{product.nameEn}</td>
                      <td className="px-6 py-3 text-sm text-foreground" dir="rtl">
                        {product.nameAr}
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{product.category}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditProduct(product)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id, product.productType)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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
    </div>
  );
}
