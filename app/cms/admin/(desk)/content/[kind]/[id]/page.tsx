import { notFound } from "next/navigation";
import { contentKindSchema } from "@/lib/content/validation";
import { getContent } from "@/lib/content/admin";
import { ContentForm } from "../../ContentForm";
export default async function EditContent({ params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  const parsed = contentKindSchema.safeParse(kind);
  if (!parsed.success) notFound();
  const values = await getContent(parsed.data, id);
  if (!values) notFound();
  return <><header className="desk-head"><h1>Edit {String(values.name ?? values.title)}</h1></header><ContentForm kind={parsed.data} values={values} /></>;
}
