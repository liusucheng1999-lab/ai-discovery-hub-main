import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackSiteVisit } from "@/lib/site-analytics";

export default function SiteVisitTracker() {
  const location = useLocation();

  useEffect(() => {
    trackSiteVisit(location.pathname);
  }, [location.pathname]);

  return null;
}
