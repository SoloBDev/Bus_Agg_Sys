"use client";

import { useEffect, useState } from "react";

const data = [
  { name: "Desktop", value: 60, color: "bg-primary" },
  { name: "Mobile", value: 30, color: "bg-primary/70" },
  { name: "Tablet", value: 10, color: "bg-primary/40" },
];

export function DevicesChart() {
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

  return (
    <div className='h-[300px] w-full flex flex-col items-center justify-center'>
      <div className='relative h-40 w-40'>
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='h-20 w-20 rounded-full bg-background'></div>
        </div>
        {data.map((segment, i) => (
          <div
            key={i}
            className={`absolute h-40 w-40 ${segment.color}`}
            style={{
              clipPath: `polygon(50% 50%, ${
                50 + 50 * Math.cos(2 * Math.PI * (i / data.length))
              }% ${50 + 50 * Math.sin(2 * Math.PI * (i / data.length))}%, ${
                50 + 50 * Math.cos(2 * Math.PI * ((i + 1) / data.length))
              }% ${
                50 + 50 * Math.sin(2 * Math.PI * ((i + 1) / data.length))
              }%)`,
            }}
          ></div>
        ))}
      </div>
      <div className='mt-8 flex justify-center gap-6'>
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className='flex items-center gap-2'>
            <div className={`w-3 h-3 rounded-full ${entry.color}`} />
            <span className='text-sm'>
              {entry.name}: {entry.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
