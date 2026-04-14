import { useEffect, useMemo, useState } from "react";
import { categoryColorMap } from "@/lib/mock-data";
import { getLogoCandidateUrls } from "@/lib/logo-utils";

interface ToolLogoAvatarProps {
  name: string;
  websiteUrl: string;
  logoUrl?: string | null;
  category: string;
  /** Outer box: size + layout, e.g. "h-12 w-12 shrink-0 rounded-lg" */
  boxClassName: string;
  /** Class for first-letter fallback, e.g. "text-xl" */
  fallbackTextClassName?: string;
}

export default function ToolLogoAvatar({
  name,
  websiteUrl,
  logoUrl,
  category,
  boxClassName,
  fallbackTextClassName = "text-xl",
}: ToolLogoAvatarProps) {
  const candidates = useMemo(
    () => getLogoCandidateUrls(websiteUrl || "", logoUrl),
    [websiteUrl, logoUrl]
  );
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setIdx(0);
    setLoaded(false);
  }, [websiteUrl, logoUrl]);

  const bgColor = categoryColorMap[category] || "hsl(0,0%,60%)";
  const showLetter = idx >= candidates.length;
  const src = !showLetter ? candidates[idx] : "";

  return (
    <div
      className={`${boxClassName} flex items-center justify-center relative overflow-hidden`}
    >
      {!showLetter && src ? (
        <>
          {!loaded && (
            <div className="absolute inset-0 bg-muted animate-pulse" aria-hidden />
          )}
          <img
            key={`${src}-${idx}`}
            src={src}
            alt=""
            className={`w-full h-full object-cover ${loaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setLoaded(true)}
            onError={() => {
              setLoaded(false);
              setIdx((i) => i + 1);
            }}
          />
        </>
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center font-bold text-white ${fallbackTextClassName}`}
          style={{ backgroundColor: bgColor }}
        >
          {name?.[0] ?? "?"}
        </div>
      )}
    </div>
  );
}
