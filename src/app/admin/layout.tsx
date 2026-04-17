import type { ReactNode } from "react";
import { AdminLayoutClient } from "./components/AdminLayoutClient";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
