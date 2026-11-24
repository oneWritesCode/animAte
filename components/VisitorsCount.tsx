"use client";

import { useEffect, useState } from "react";

const GOATCOUNTER_CODE = "animate"; // your site code

// (Use "%2F" instead to count only the home page.)
const COUNTER_URL = `https://${GOATCOUNTER_CODE}.goatcounter.com/counter/TOTAL.json`;

export default function VisitorCount() {
  const [visitors, setVisitors] = useState<string | null>(null);
  useEffect(() => {
    // Ignore the answer if the navbar unmounts before it arrives.
    let isCancelled = false;

    fetch(COUNTER_URL)
      .then((response) => {
        if (!response.ok)
          throw new Error(`GoatCounter answered ${response.status}`);
        return response.json();
      })
      .then((data: { count?: string }) => {
        if (!isCancelled && data.count) setVisitors(data.count);
      })
      .catch(() => {
        // No count yet: show nothing instead of a wrong number.
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (visitors === null) return null;

  return <>{visitors} visitors</>;
}
