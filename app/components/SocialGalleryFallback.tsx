import Image from "next/image";
import type { SocialReel } from "./SocialGalleryBoundary";

export default function SocialGalleryFallback({ items }: { items: readonly SocialReel[] }) {
  return <div className="social-gallery social-gallery-fallback" aria-label="Instagram reels">
    {items.map(item => <a key={item.href ?? item.image} href={item.href} target="_blank" rel="noopener noreferrer">
      <Image src={item.image} alt={item.alt ?? "Instagram reel"} width={326} height={474} sizes="(max-width: 640px) 65vw, 326px" />
    </a>)}
  </div>;
}
