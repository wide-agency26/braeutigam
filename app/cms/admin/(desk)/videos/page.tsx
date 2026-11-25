import { verifySession } from "@/lib/auth/dal";
import { prisma } from "@/lib/prisma";
import { VIDEO_SLOTS } from "@/lib/videos";
import VideoForm from "./VideoForm";

export default async function VideosPage() {
  await verifySession();
  let videos;
  try { videos = await prisma.siteVideo.findMany(); }
  catch { return <><h1>Videos</h1><p className="desk-banner">Video storage is not ready. Apply the SiteVideo migration to this environment, then reload.</p></>; }
  return <>
    <header className="desk-head"><div><h1>Videos</h1><p className="desk-lede">Manage the five career films. Each position can share one video or use separate DE/EN videos.</p></div></header>
    <div className="desk-videos">{VIDEO_SLOTS.map(slot => <VideoForm key={slot.id} slot={slot} video={videos.find(video => video.slot === slot.id)} />)}</div>
  </>;
}
