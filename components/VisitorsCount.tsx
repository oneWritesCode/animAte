"use client";

import { useEffect, useState } from "react";

export default function VisitorCount() {
  const [visitors, setVisitors] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/visitors")
      .then((response) => response.json())
      .then((data) => setVisitors(data.visitors))
      .catch(() => setVisitors(null));
  }, []);

  if (visitors === null) return null;

  return (
    <div className="text-sm rounded-[0.75rem] border-2 border-gray-200 shadow-md px-3 py-1.5 bg-white">
      {visitors.toLocaleString()} visitors
    </div>
  );
}