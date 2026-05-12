import type { SVGProps } from "react";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name" | "stroke"> {
  name: string;
  size?: number;
  stroke?: number;
}

export function Icon({ name, size = 18, stroke = 1.75, ...rest }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    ...rest,
  };
  switch (name) {
    case "home": return <svg {...common}><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>;
    case "sparkles": return <svg {...common}><path d="M12 4l1.5 4.5L18 10l-4.5 1.5L12 16l-1.5-4.5L6 10l4.5-1.5z"/><path d="M19 4l.7 2 2 .7-2 .7L19 9.4l-.7-2-2-.7 2-.7z"/></svg>;
    case "mic": return <svg {...common}><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>;
    case "pen": return <svg {...common}><path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/></svg>;
    case "edit": return <svg {...common}><path d="M4 20l4-1 11-11-3-3L5 16l-1 4z"/></svg>;
    case "book": return <svg {...common}><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 0 0 4h12"/></svg>;
    case "chart": return <svg {...common}><path d="M4 20V8M10 20V4M16 20v-8M22 20H2"/></svg>;
    case "flame": return <svg {...common}><path d="M12 3c1 3 4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 2-4-2 0-2 4-2 5a6 6 0 0 0 12 0c0-6-5-7-8-9z"/></svg>;
    case "globe": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>;
    case "chevron": return <svg {...common}><path d="M9 6l6 6-6 6"/></svg>;
    case "chevron-down": return <svg {...common}><path d="M6 9l6 6 6-6"/></svg>;
    case "check": return <svg {...common}><path d="M5 12l5 5L20 7"/></svg>;
    case "x": return <svg {...common}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case "plus": return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case "play": return <svg {...common}><path d="M8 5l11 7-11 7z"/></svg>;
    case "pause": return <svg {...common}><path d="M7 5v14M17 5v14"/></svg>;
    case "refresh": return <svg {...common}><path d="M20 11A8 8 0 1 0 12 20"/><path d="M20 4v7h-7"/></svg>;
    case "send": return <svg {...common}><path d="M3 11l18-8-7 18-3-7-8-3z"/></svg>;
    case "shield": return <svg {...common}><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/></svg>;
    case "users": return <svg {...common}><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M15 20c0-2 2-3.5 4-3.5s2 .5 2 2"/></svg>;
    case "graph": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 4"/></svg>;
    case "panel": return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="6"/><path d="M20 20l-4-4"/></svg>;
    case "star": return <svg {...common}><path d="M12 3l2.7 5.7 6.3.9-4.6 4.4 1.1 6.3L12 17.8 6.5 20.3l1.1-6.3L3 9.6l6.3-.9z"/></svg>;
    case "lock": return <svg {...common}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>;
    case "sound": return <svg {...common}><path d="M3 10v4h4l5 4V6L7 10H3z"/><path d="M16 8c1.5 1.5 1.5 6.5 0 8"/></svg>;
    case "eye": return <svg {...common}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "download": return <svg {...common}><path d="M12 4v12M6 12l6 6 6-6M4 20h16"/></svg>;
    case "bolt": return <svg {...common}><path d="M13 3L4 14h7l-1 7 9-11h-7z"/></svg>;
    case "snowflake": return <svg {...common}><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/></svg>;
    case "badge": return <svg {...common}><path d="M12 2l3 3 4 0 0 4 3 3-3 3 0 4-4 0-3 3-3-3-4 0 0-4-3-3 3-3 0-4 4 0z"/></svg>;
    case "speech": return <svg {...common}><path d="M4 5h16v11H8l-4 4z"/></svg>;
    case "arrowR": return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "arrowL": return <svg {...common}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>;
    case "sun": return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
    case "moon": return <svg {...common}><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8z"/></svg>;
    case "card": return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></svg>;
    case "repeat": return <svg {...common}><path d="M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3"/></svg>;
    case "target": return <svg {...common}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg>;
    case "warn": return <svg {...common}><path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "chat": return <svg {...common}><path d="M4 5h16v11H8l-4 4z"/><path d="M8 10h8M8 13h5"/></svg>;
    default: return null;
  }
}
