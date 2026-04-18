"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import * as api from "@/lib/api";
import type { ReviewData, Language, ProductType, Product, Order, ContactMessage } from "./types";
import { CATEGORY_TO_API } from "./mappers";
import {
  bustAdminMessagesDedupe,
  bustAdminProductDataDedupe,
  bustAdminReviewsDedupe,
  loadAdminProducts,
  loadAdminMessages,
  loadAdminReviews,
} from "./loaders";
import { adminTranslations } from "./i18n";

export type AdminTranslations = (typeof adminTranslations)["en"];

export type ProductFormState = {
  nameEn: string;
  nameAr: string;
  category: string;
  productType: ProductType;
  price: number;
  discountPrice: number;
  rating: number;
  ratingCount: number;
  descriptionEn: string;
  descriptionAr: string;
  ingredientsEn: string;
  ingredientsAr: string;
  benefitsEn: string;
  benefitsAr: string;
  howToUseEn: string;
  howToUseAr: string;
  ingredients: string[];
  isFeatured: boolean;
};

type AdminContextValue = {
  language: Language;
  setLanguage: (l: Language) => void;
  t: AdminTranslations;
  isRTL: boolean;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  messages: ContactMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ContactMessage[]>>;
  reviews: ReviewData[];
  setReviews: React.Dispatch<React.SetStateAction<ReviewData[]>>;
  /** Refetch products from API (also used after product create/update/delete). */
  refreshProducts: () => Promise<void>;
  refreshMessages: () => Promise<void>;
  refreshReviews: () => Promise<void>;
  handleLogout: () => void;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  messageStatusFilter: string;
  setMessageStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  adminProfile: { email: string; password: string };
  setAdminProfile: React.Dispatch<React.SetStateAction<{ email: string; password: string }>>;
  isEditingProfile: boolean;
  setIsEditingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showChangePassword: boolean;
  setShowChangePassword: React.Dispatch<React.SetStateAction<boolean>>;
  showProductModal: boolean;
  setShowProductModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  productTab: string;
  setProductTab: React.Dispatch<React.SetStateAction<string>>;
  showOrderModal: boolean;
  setShowOrderModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedOrder: Order | null;
  setSelectedOrder: React.Dispatch<React.SetStateAction<Order | null>>;
  showMessageModal: boolean;
  setShowMessageModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMessage: ContactMessage | null;
  setSelectedMessage: React.Dispatch<React.SetStateAction<ContactMessage | null>>;
  showReviewModal: boolean;
  setShowReviewModal: React.Dispatch<React.SetStateAction<boolean>>;
  editingReview: ReviewData | null;
  setEditingReview: React.Dispatch<React.SetStateAction<ReviewData | null>>;
  productImageFile: File | null;
  setProductImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  productImagePreview: string;
  setProductImagePreview: React.Dispatch<React.SetStateAction<string>>;
  productImageInputRef: React.RefObject<HTMLInputElement | null>;
  productFormData: ProductFormState;
  setProductFormData: React.Dispatch<React.SetStateAction<ProductFormState>>;
  handleAddProduct: () => void;
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (id: string, productType: ProductType) => Promise<void>;
  handleSaveProduct: (e: React.FormEvent) => Promise<void>;
  handlePickProductImage: () => void;
  handleProductImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getStatusColor: (status: string) => string;
  handleViewOrderDetails: (order: Order) => void;
  handleChangePassword: (e: React.FormEvent) => void;
  handleViewMessage: (message: ContactMessage) => Promise<void>;
  handleToggleMessageStatus: (id: string) => Promise<void>;
  handleDeleteMessage: (id: string) => Promise<void>;
  handleAddIngredient: (ingredient: string) => void;
  handleRemoveIngredient: (index: number) => void;
  handleAddReview: () => void;
  handleEditReview: (review: ReviewData) => void;
  handleDeleteReview: (id: string) => Promise<void>;
  handleSaveReview: (e: React.FormEvent) => Promise<void>;
  getOrderStatsByStatus: (status: Order["status"]) => { count: number; percentChange: number };
};

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");
  const [showPassword, setShowPassword] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productTab, setProductTab] = useState("description");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewData | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [messageStatusFilter, setMessageStatusFilter] = useState("");
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState("");
  const productImageInputRef = useRef<HTMLInputElement>(null);
  const [productFormData, setProductFormData] = useState({
    nameEn: "",
    nameAr: "",
    category: "Hair Care",
    productType: "default" as ProductType,
    price: 0,
    discountPrice: 0,
    rating: 0,
    ratingCount: 0,
    descriptionEn: "",
    descriptionAr: "",
    ingredientsEn: "",
    ingredientsAr: "",
    benefitsEn: "",
    benefitsAr: "",
    howToUseEn: "",
    howToUseAr: "",
    ingredients: [] as string[],
    isFeatured: false,
  });
  const [adminProfile, setAdminProfile] = useState({
    email: "admin@lamorq.com",
    password: "••••••••",
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [reviews, setReviews] = useState<ReviewData[]>([]);

  const isRTL = language === "ar";
  const t = adminTranslations[language] as AdminTranslations;

  const refreshProducts = useCallback(async () => {
    try {
      bustAdminProductDataDedupe();
      setProducts(await loadAdminProducts());
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to load products");
    }
  }, []);

  const refreshMessages = useCallback(async () => {
    try {
      bustAdminMessagesDedupe();
      setMessages(await loadAdminMessages());
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to load messages");
    }
  }, []);

  const refreshReviews = useCallback(async () => {
    try {
      bustAdminReviewsDedupe();
      setReviews(await loadAdminReviews());
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to load reviews");
    }
  }, []);

  const handleLogout = useCallback(() => {
    api.clearStoredToken();
    setProducts([]);
    setOrders([]);
    setMessages([]);
    setReviews([]);
    router.replace("/admin-auth");
  }, [router]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductImageFile(null);
    setProductImagePreview("");
    if (productImageInputRef.current) productImageInputRef.current.value = "";
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductImageFile(null);
    setProductImagePreview("");
    if (productImageInputRef.current) productImageInputRef.current.value = "";
    setProductFormData({
      nameEn: product.nameEn,
      nameAr: product.nameAr,
      category: product.category,
      productType: product.productType,
      price: product.price || 0,
      discountPrice: product.discountPrice || 0,
      rating: product.rating || 0,
      ratingCount: product.ratingCount || 0,
      descriptionEn: product.descriptionEn || "",
      descriptionAr: product.descriptionAr || "",
      ingredientsEn: product.ingredientsDescriptionEn || "",
      ingredientsAr: product.ingredientsDescriptionAr || "",
      benefitsEn: product.benefitsEn || "",
      benefitsAr: product.benefitsAr || "",
      howToUseEn: product.howToUseEn || "",
      howToUseAr: product.howToUseAr || "",
      ingredients: product.ingredients || [],
      isFeatured: product.isFeatured,
    });
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (id: string, productType: ProductType) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      if (productType === "default") await api.deleteDefaultProduct(id);
      else await api.deleteUpcomingProduct(id);
      await refreshProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const categorySlug = CATEGORY_TO_API[productFormData.category] || "hair_care";

    const appendDefaultFields = (fd: FormData) => {
      fd.append("nameEn", productFormData.nameEn);
      fd.append("nameAr", productFormData.nameAr);
      fd.append("category", categorySlug);
      fd.append("productType", "default_product");
      fd.append("price", String(productFormData.price));
      fd.append("discountPrice", String(productFormData.discountPrice));
      fd.append("rating", String(productFormData.rating));
      fd.append("ratingCount", String(productFormData.ratingCount));
      fd.append("ingredients", JSON.stringify(productFormData.ingredients));
      fd.append("isFeatured", String(productFormData.isFeatured));
      fd.append("descriptionEn", productFormData.descriptionEn);
      fd.append("descriptionAr", productFormData.descriptionAr);
      fd.append("ingredientsDescriptionEn", productFormData.ingredientsEn);
      fd.append("ingredientsDescriptionAr", productFormData.ingredientsAr);
      fd.append("benefitsEn", productFormData.benefitsEn);
      fd.append("benefitsAr", productFormData.benefitsAr);
      fd.append("howToUseEn", productFormData.howToUseEn);
      fd.append("howToUseAr", productFormData.howToUseAr);
      if (productImageFile) fd.append("image", productImageFile);
    };

    const appendUpcomingFields = (fd: FormData) => {
      fd.append("nameEn", productFormData.nameEn);
      fd.append("nameAr", productFormData.nameAr);
      fd.append("category", categorySlug);
      fd.append("isFeatured", String(productFormData.isFeatured));
      fd.append("descriptionEn", productFormData.descriptionEn);
      fd.append("descriptionAr", productFormData.descriptionAr);
      if (productImageFile) fd.append("image", productImageFile);
    };

    try {
      if (editingProduct) {
        if (productFormData.productType === "default") {
          const fd = new FormData();
          appendDefaultFields(fd);
          await api.updateDefaultProduct(editingProduct.id, fd);
        } else {
          const fd = new FormData();
          appendUpcomingFields(fd);
          await api.updateUpcomingProduct(editingProduct.id, fd);
        }
      } else if (productFormData.productType === "default") {
        const fd = new FormData();
        appendDefaultFields(fd);
        await api.createDefaultProduct(fd);
      } else {
        const fd = new FormData();
        appendUpcomingFields(fd);
        await api.createUpcomingProduct(fd);
      }

      await refreshProducts();
      setShowProductModal(false);
      setProductImageFile(null);
      setProductImagePreview("");
      if (productImageInputRef.current) productImageInputRef.current.value = "";
      setProductFormData({
        nameEn: "",
        nameAr: "",
        category: "Hair Care",
        productType: "default",
        price: 0,
        discountPrice: 0,
        rating: 0,
        ratingCount: 0,
        descriptionEn: "",
        descriptionAr: "",
        ingredientsEn: "",
        ingredientsAr: "",
        benefitsEn: "",
        benefitsAr: "",
        howToUseEn: "",
        howToUseAr: "",
        ingredients: [],
        isFeatured: false,
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handlePickProductImage = () => productImageInputRef.current?.click();

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProductImageFile(file);
    setProductImagePreview(URL.createObjectURL(file));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "on-processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password changed successfully!");
    setIsEditingProfile(false);
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    if (message.status !== "read") {
      try {
        await api.updateMessage(message.id, { status: "read" });
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? { ...m, status: "read" as const } : m))
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleMessageStatus = async (id: string) => {
    const message = messages.find((m) => m.id === id);
    if (!message) return;
    const nextStatus = message.status === "read" ? "un-read" : "read";
    try {
      await api.updateMessage(id, { status: nextStatus });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, status: nextStatus === "read" ? "read" : ("unread" as const) }
            : m
        )
      );
      setSelectedMessage((prev) =>
        prev && prev.id === id ? { ...prev, status: nextStatus === "read" ? "read" : "unread" } : prev
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      await api.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleAddIngredient = (ingredient: string) => {
    if (ingredient.trim() && !productFormData.ingredients.includes(ingredient.trim())) {
      setProductFormData({
        ...productFormData,
        ingredients: [...productFormData.ingredients, ingredient.trim()],
      });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setProductFormData({
      ...productFormData,
      ingredients: productFormData.ingredients.filter((_, i) => i !== index),
    });
  };

  const handleAddReview = () => {
    setEditingReview(null);
    setShowReviewModal(true);
  };

  const handleEditReview = (review: ReviewData) => {
    setEditingReview(review);
    setShowReviewModal(true);
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.deleteRating(id);
      await refreshReviews();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleSaveReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const customerName = formData.get("customerName") as string;
    const contextEn = String(formData.get("contextEn") ?? "").trim();
    const contextAr = String(formData.get("contextAr") ?? "").trim();
    const rating = Number(formData.get("rating"));

    try {
      if (editingReview) {
        await api.updateRating(editingReview.id, {
          name: customerName,
          contextEn,
          contextAr,
          rating,
        });
      } else {
        await api.createRating({
          name: customerName,
          contextEn,
          contextAr,
          rating,
        });
      }
      await refreshReviews();
      setShowReviewModal(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    }
  };

  const getOrderStatsByStatus = (status: Order["status"]) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const thisMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.date);
      return (
        order.status === status &&
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      );
    }).length;

    const lastMonthOrders = orders.filter((order) => {
      const orderDate = new Date(order.date);
      return (
        order.status === status &&
        orderDate.getMonth() === lastMonth &&
        orderDate.getFullYear() === lastMonthYear
      );
    }).length;

    const percentChange =
      lastMonthOrders > 0
        ? Math.round(((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100)
        : 0;

    return { count: thisMonthOrders, percentChange };
  };

  const value: AdminContextValue = {
    language,
    setLanguage,
    t,
    isRTL,
    products,
    setProducts,
    orders,
    setOrders,
    messages,
    setMessages,
    reviews,
    setReviews,
    refreshProducts,
    refreshMessages,
    refreshReviews,
    handleLogout,
    searchQuery,
    setSearchQuery,
    messageStatusFilter,
    setMessageStatusFilter,
    adminProfile,
    setAdminProfile,
    isEditingProfile,
    setIsEditingProfile,
    showPassword,
    setShowPassword,
    showChangePassword,
    setShowChangePassword,
    showProductModal,
    setShowProductModal,
    editingProduct,
    setEditingProduct,
    productTab,
    setProductTab,
    showOrderModal,
    setShowOrderModal,
    selectedOrder,
    setSelectedOrder,
    showMessageModal,
    setShowMessageModal,
    selectedMessage,
    setSelectedMessage,
    showReviewModal,
    setShowReviewModal,
    editingReview,
    setEditingReview,
    productImageFile,
    setProductImageFile,
    productImagePreview,
    setProductImagePreview,
    productImageInputRef,
    productFormData,
    setProductFormData,
    handleAddProduct,
    handleEditProduct,
    handleDeleteProduct,
    handleSaveProduct,
    handlePickProductImage,
    handleProductImageChange,
    getStatusColor,
    handleViewOrderDetails,
    handleChangePassword,
    handleViewMessage,
    handleToggleMessageStatus,
    handleDeleteMessage,
    handleAddIngredient,
    handleRemoveIngredient,
    handleAddReview,
    handleEditReview,
    handleDeleteReview,
    handleSaveReview,
    getOrderStatsByStatus,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
