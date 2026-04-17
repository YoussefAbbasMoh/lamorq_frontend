"use client";

import { useAdmin } from "../admin-context";

export function RegionPricesScreen() {
  const { t, shippingPrice, setShippingPrice, handleSaveShippingPrice } = useAdmin();

  return (
    <div>
      <h1 className="text-3xl text-foreground mb-8">{t.regionPrices}</h1>
      <p className="text-gray-600 text-sm mb-6 max-w-2xl">
        Configure default shipping and regional pricing. Additional regions can be wired to the API when
        available.
      </p>

      <div className="bg-white rounded-xl p-6 shadow-sm mb-6 max-w-2xl">
        <h2 className="text-xl font-semibold text-foreground mb-4">{t.manageShipping}</h2>
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-foreground mb-2">{t.shippingPrice}</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={shippingPrice}
                onChange={(e) => setShippingPrice(Number(e.target.value))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="Enter shipping price"
              />
              <span className="text-foreground text-sm font-medium">{t.egp}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSaveShippingPrice}
            className="bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            {t.save}
          </button>
        </div>
      </div>
    </div>
  );
}
