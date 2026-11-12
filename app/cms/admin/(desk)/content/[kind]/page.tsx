import Link from "next/link";
import { notFound } from "next/navigation";
import { contentKindSchema } from "@/lib/content/validation";
import { CONTENT_LABELS, listContent } from "@/lib/content/admin";

export default async function ContentList({ params, searchParams }: { params: Promise<{ kind: string }>; searchParams: Promise<{ saved?: string; removed?: string }> }) {
  const parsed = contentKindSchema.safeParse((await params).kind);
  if (!parsed.success) notFound();
  const kind = parsed.data;
  const [entries, search] = await Promise.all([listContent(kind), searchParams]);
  return <>
    <header className="desk-head"><div><h1>{CONTENT_LABELS[kind]}</h1><p className="desk-lede">Manage what appears on the public website in German and English.</p></div>
      <Link className="desk-btn desk-btn-primary" href={`/cms/admin/content/${kind}/new`}>Add {kind === "team" ? "team member" : kind === "videos" ? "video" : "reel"}</Link>
    </header>
    {search.saved ? <p className="desk-notice" role="status">Entry saved. Drafts remain hidden; published entries appear on the website.</p> : null}
    {search.removed ? <p className="desk-notice" role="status">Entry removed from the website.</p> : null}
    {kind === "reels" ? <p className="desk-hint">The home-page gallery uses these reel links and covers. This is an editorial list; adding a reel on Instagram does not automatically publish it here.</p> : null}
    {entries.length ? <div className="desk-table-wrap"><table className="desk-table"><thead><tr><th>Entry</th><th>{kind === "videos" ? "Placement" : kind === "reels" ? "Instagram link" : "Role"}</th><th>Status</th></tr></thead>
      <tbody>{entries.map(entry => <tr key={entry.id}><td><Link href={`/cms/admin/content/${kind}/${entry.id}`}>{entry.title}</Link></td><td className="desk-break">{entry.detail}</td><td>{entry.published ? "Published" : "Draft"}</td></tr>)}</tbody>
    </table></div> : <p className="desk-empty">No entries yet. Add the first one.</p>}
  </>;
}
