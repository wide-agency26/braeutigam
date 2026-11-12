import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Website CMS | Bräutigam",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="desk">{children}</div>;
}
