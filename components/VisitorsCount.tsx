"use client";

import { useEffect, useState } from "react";

const GOATCOUNTER_CODE = "animate"; // your site code

export default function VisitorCount() {
  const [visitors, setVisitors] = useState<string | null>(null);

  useEffect(() => {
    fetch(`https://${GOATCOUNTER_CODE}.goatcounter.com/counter/%2F  .json`)
      .then((response) => response.json())
      .then((data) => setVisitors(data.count))
      .catch(() => setVisitors(null));
  }, []);

  // if (visitors === null) return <>0 visitors</>;

  return <>{visitors} visitors</>;
}
