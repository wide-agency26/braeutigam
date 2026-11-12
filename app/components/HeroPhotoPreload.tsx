/**
 * Injects a hero JPEG preload that matches the theme the user will actually see
 * (same localStorage + default as the blocking script in root layout).
 */
export default function HeroPhotoPreload({
  lightSrc,
  darkSrc,
}: {
  lightSrc: string;
  darkSrc: string;
}) {
  const light = JSON.stringify(lightSrc);
  const dark = JSON.stringify(darkSrc);
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var t=localStorage.getItem('braeutigam-theme');var isLight=t==='light';if(t!=='light'&&t!=='dark'){isLight=document.documentElement.classList.contains('light')}var href=isLight?${light}:${dark};var l=document.createElement('link');l.rel='preload';l.as='image';l.href=href;document.head.appendChild(l)}catch(e){}})();`,
      }}
    />
  );
}
