"use client";

import { useEffect, useState } from "react";

const GOATCOUNTER_CODE = "animate"; // your site code

export default function VisitorCount() {
  const [visitors, setVisitors] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://${GOATCOUNTER_CODE}.goatcounter.com/counter/TOTAL.json`)
      .then((response) => response.json())
      .then((data) => setVisitors(data.count))
      .catch(() => setVisitors(null));
  }, []);

  if (visitors === null) return 0;

  return (
    <div className="text-sm rounded-[0.75rem] border-2 border-gray-200 shadow-md px-3 py-1.5 bg-white">
      {visitors} visitors
    </div>
  );
}
