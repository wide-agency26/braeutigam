import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { contentKindSchema } from "@/lib/content/validation";
import { CONTENT_LABELS } from "@/lib/content/admin";
import { ContentForm } from "../../ContentForm";
export default async function NewContent({ params }: { params: Promise<{ kind: string }> }) {
  await verifySession();
  const parsed = contentKindSchema.safeParse((await params).kind);
  if (!parsed.success) notFound();
  return <><header className="desk-head"><h1>Add to {CONTENT_LABELS[parsed.data].toLowerCase()}</h1></header><ContentForm kind={parsed.data} /></>;
}
