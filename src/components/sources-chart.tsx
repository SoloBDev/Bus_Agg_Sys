"use client";

import { useEffect, useState } from "react";

const data = [
  { source: "Addis Ababa - Gondar", visitors: 5000 },
  { source: "DireDawa - Addis Ababa", visitors: 4000 },
  { source: "Jimma - Mizan", visitors: 3000 },
  { source: "Addis Ababa - Bahirdar", visitors: 2000 },
  { source: "Addis Ababa - Axum", visitors: 1500 },
];

export function SourcesChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className='h-[300px] w-full flex items-center justify-center'>
        <p className='text-muted-foreground'>Loading chart...</p>
      </div>
    );
  }

  const maxVisitors = Math.max(...data.map((item) => item.visitors));

  return (
    <div className='h-[300px] w-full'>
      <div className='space-y-4'>
        {data.map((item, index) => (
          <div key={index} className='flex flex-col gap-1'>
            <div className='flex justify-between text-sm'>
              <span>{item.source}</span>
              <span>{item.visitors.toLocaleString()}</span>
            </div>
            <div className='h-2 w-full rounded-full bg-muted'>
              <div
                className='h-2 rounded-full bg-primary'
                style={{ width: `${(item.visitors / maxVisitors) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
