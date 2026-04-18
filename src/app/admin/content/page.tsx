import { redirect } from "next/navigation";

/** Old URL; ratings moved to /admin/ratings */
export default function LegacyAdminContentRedirect() {
  redirect("/admin/ratings");
}
