"use client";

import { X, Upload } from "lucide-react";
import { useAdmin } from "../admin-context";
import type { ProductType } from "../types";

export function AdminModals() {
  const {
    t,
    showProductModal,
    setShowProductModal,
    editingProduct,
    productImageInputRef,
    handleProductImageChange,
    handlePickProductImage,
    handleSaveProduct,
    productFormData,
    setProductFormData,
    productImagePreview,
    setProductImageFile,
    setProductImagePreview,
    handleRemoveIngredient,
    handleAddIngredient,
    productTab,
    setProductTab,
    showOrderModal,
    setShowOrderModal,
    selectedOrder,
    getStatusColor,
    showMessageModal,
    setShowMessageModal,
    selectedMessage,
    handleToggleMessageStatus,
    showReviewModal,
    setShowReviewModal,
    editingReview,
    handleSaveReview,
  } = useAdmin();

  return (
    <>
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl text-foreground">
                {editingProduct ? t.editProduct : t.addProduct}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowProductModal(false);
                  setProductImageFile(null);
                  setProductImagePreview("");
                  if (productImageInputRef.current) productImageInputRef.current.value = "";
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div>
                  <label className="block text-sm text-foreground mb-2">{t.uploadImage}</label>
                  <input
                    ref={productImageInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={handleProductImageChange}
                  />
                  <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handlePickProductImage();
                    }}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer"
                    onClick={handlePickProductImage}
                  >
                    {(productImagePreview || editingProduct?.image) && (
                      <img
                        src={productImagePreview || editingProduct?.image}
                        alt=""
                        className="max-h-40 mx-auto mb-3 rounded-lg object-contain"
                      />
                    )}
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-foreground mb-2">
                      {t.productName} (English)
                    </label>
                    <input
                      type="text"
                      defaultValue={editingProduct?.nameEn}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Product name in English"
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, nameEn: e.target.value })
                      }
                    />
                  </div>
                  <div dir="rtl">
                    <label className="block text-sm text-foreground mb-2">
                      {t.productName} (العربية)
                    </label>
                    <input
                      type="text"
                      defaultValue={editingProduct?.nameAr}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="اسم المنتج بالعربية"
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, nameAr: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-foreground mb-2">Product Type</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      value={productFormData.productType}
                      onChange={(e) =>
                        setProductFormData({
                          ...productFormData,
                          productType: e.target.value as ProductType,
                        })
                      }
                    >
                      <option value="default">Default Product</option>
                      <option value="upcoming">Upcoming Product</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-foreground mb-2">{t.category}</label>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      value={productFormData.category}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, category: e.target.value })
                      }
                    >
                      <option>Hair Care</option>
                      <option>Skin Care</option>
                      <option>Body Care</option>
                    </select>
                  </div>
                </div>

                {productFormData.productType === "default" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-foreground mb-2">{t.price}</label>
                        <input
                          type="number"
                          defaultValue={editingProduct?.price}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="280"
                          onChange={(e) =>
                            setProductFormData({
                              ...productFormData,
                              price: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-foreground mb-2">{t.discountPrice}</label>
                        <input
                          type="number"
                          defaultValue={editingProduct?.discountPrice}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="400"
                          onChange={(e) =>
                            setProductFormData({
                              ...productFormData,
                              discountPrice: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-foreground mb-2">{t.rating}</label>
                        <input
                          type="number"
                          step="0.1"
                          max="5"
                          defaultValue={editingProduct?.rating}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="4.5"
                          onChange={(e) =>
                            setProductFormData({
                              ...productFormData,
                              rating: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-foreground mb-2">
                          Rating Count (Reviews)
                        </label>
                        <input
                          type="number"
                          defaultValue={editingProduct?.ratingCount}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="128"
                          onChange={(e) =>
                            setProductFormData({
                              ...productFormData,
                              ratingCount: parseInt(e.target.value, 10),
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-foreground mb-2">
                        Ingredients (as shown on product details page)
                      </label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {productFormData.ingredients.map((ingredient, index) => (
                          <span
                            key={ingredient + String(index)}
                            className="inline-flex items-center gap-2 bg-secondary text-foreground px-3 py-1 rounded-full text-sm"
                          >
                            {ingredient}
                            <button
                              type="button"
                              onClick={() => handleRemoveIngredient(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Add ingredient (e.g., Argan Oil)"
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddIngredient((e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = "";
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            handleAddIngredient(input.value);
                            input.value = "";
                          }}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productFormData.isFeatured}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, isFeatured: e.target.checked })
                      }
                      className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-ring"
                    />
                    <div>
                      <span className="text-sm text-foreground font-medium">
                        ★ Mark as Featured Product
                      </span>
                      <p className="text-xs text-gray-600 mt-1">
                        Featured products will be displayed in the &quot;Featured Products&quot;
                        section on the home page
                      </p>
                    </div>
                  </label>
                </div>

                <div>
                  <div className="flex gap-4 border-b border-gray-200 mb-4">
                    {(productFormData.productType === "default"
                      ? ["description", "ingredients", "benefits", "howToUse"]
                      : ["description"]
                    ).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setProductTab(tab)}
                        className={`pb-3 text-sm transition-colors ${
                          productTab === tab
                            ? "text-primary border-b-2 border-primary"
                            : "text-gray-500 hover:text-foreground"
                        }`}
                      >
                        {t[tab as keyof typeof t]}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder={`Enter ${productTab} in English`}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        [`${productTab}En`]: e.target.value,
                      } as typeof productFormData)
                    }
                  />

                  <textarea
                    rows={4}
                    dir="rtl"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring mt-3"
                    placeholder={`أدخل ${productTab} بالعربية`}
                    onChange={(e) =>
                      setProductFormData({
                        ...productFormData,
                        [`${productTab}Ar`]: e.target.value,
                      } as typeof productFormData)
                    }
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {t.save}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProductModal(false);
                      setProductImageFile(null);
                      setProductImagePreview("");
                      if (productImageInputRef.current) productImageInputRef.current.value = "";
                    }}
                    className="flex-1 border border-gray-300 text-foreground py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showOrderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl text-foreground">Order Details</h2>
              <button
                type="button"
                onClick={() => setShowOrderModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {selectedOrder && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order ID</p>
                      <p className="text-sm text-foreground font-medium">#{selectedOrder.id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-sm text-gray-700">{selectedOrder.date}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Customer Phone</p>
                    <p className="text-sm text-gray-700">{selectedOrder.customerPhone}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                      <p className="text-sm text-primary font-semibold">{selectedOrder.total} EGP</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                      <p className="text-sm text-gray-700">{selectedOrder.paymentMethod}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order Status</p>
                    <span
                      className={`inline-block text-xs px-3 py-1 rounded-full ${getStatusColor(selectedOrder.status)}`}
                    >
                      {t[selectedOrder.status as keyof typeof t]}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl text-foreground">Message Details</h2>
              <button
                type="button"
                onClick={() => setShowMessageModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Message ID</p>
                    <p className="text-sm text-foreground font-medium">#{selectedMessage.id}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="text-sm text-gray-700">{selectedMessage.date}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Name</p>
                  <p className="text-sm text-gray-700">{selectedMessage.firstName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-700">{selectedMessage.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-sm text-gray-700">{selectedMessage.phone}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Subject</p>
                  <p className="text-sm text-gray-700">{selectedMessage.subject}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Message</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                    {selectedMessage.message}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Status</p>
                  <button
                    type="button"
                    onClick={() => handleToggleMessageStatus(selectedMessage.id)}
                    className={`inline-block text-xs px-3 py-1 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${
                      selectedMessage.status === "unread"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {selectedMessage.status} (Click to toggle)
                  </button>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowMessageModal(false)}
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl text-foreground">
                {editingReview ? t.editReview : t.addReview}
              </h2>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSaveReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.customerName}
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    defaultValue={editingReview?.customerName || ""}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                    placeholder="Enter customer name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.reviewContent}
                  </label>
                  <textarea
                    name="reviewContent"
                    defaultValue={editingReview?.reviewContent || ""}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none text-foreground"
                    placeholder="Enter review content"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">{t.rating}</label>
                  <select
                    name="rating"
                    defaultValue={editingReview?.rating || 5}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                  >
                    <option value={5}>5 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={2}>2 Stars</option>
                    <option value={1}>1 Star</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {t.save}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 border border-gray-300 text-foreground py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
