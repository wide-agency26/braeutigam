import { verifySession } from "@/lib/auth/dal";
import { AdminShell } from "./AdminShell";

export const dynamic = "force-dynamic";

export default async function DeskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();
  return <AdminShell email={session.email}>{children}</AdminShell>;
}
