"use client";

import { useEffect, useState } from "react";

export function MainChart() {
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
    <div className='h-[300px] w-full'>
      <div className='flex h-full flex-col'>
        <div className='flex h-full items-end gap-2'>
          {/* Simplified chart representation */}
          {[40, 70, 30, 60, 50, 80, 60, 90, 100, 85, 110, 120].map(
            (height, i) => (
              <div key={i} className='relative w-full'>
                <div
                  className='absolute bottom-0 w-full rounded-md bg-primary/90 transition-all duration-300'
                  style={{ height: `${height}px` }}
                ></div>
              </div>
            )
          )}
        </div>
        <div className='mt-4 flex justify-between text-xs text-muted-foreground'>
          <div>Jan</div>
          <div>Feb</div>
          <div>Mar</div>
          <div>Apr</div>
          <div>May</div>
          <div>Jun</div>
          <div>Jul</div>
          <div>Aug</div>
          <div>Sep</div>
          <div>Oct</div>
          <div>Nov</div>
          <div>Dec</div>
        </div>
      </div>
      <div className='!mt-10 flex items-center justify-center gap-4 '>
        <div className='flex items-center gap-2'>
          <div className='h-3 w-3 rounded-full bg-primary '></div>
          <span className='text-sm'>Visitors</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='h-3 w-3 rounded-full bg-primary/60'></div>
          <span className='text-sm'>Revenue</span>
        </div>
      </div>
    </div>
  );
}
