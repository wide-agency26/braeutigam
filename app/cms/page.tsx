import { redirect } from "next/navigation";
import { CMS_BASE } from "@/lib/cms";

export default function CmsIndexPage() {
  redirect(CMS_BASE);
}
