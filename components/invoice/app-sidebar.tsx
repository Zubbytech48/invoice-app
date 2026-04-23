'use client';

// import { FileText } from 'lucide-react';
//
import { LogoShape } from "@/components/LogoShape";
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';

export function AppSidebar() {
  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-40 bg-slate-800 dark:bg-slate-900',
        // Mobile: horizontal bar at top
        'w-full h-16 flex flex-row items-center justify-between pl-0 pr-6',
        // Desktop: vertical sidebar on left
        'lg:w-24 lg:h-screen lg:flex-col lg:px-0 lg:py-0 lg:rounded-r-3xl'
      )}
    >
      {/* Logo */}
      <div className="lg:w-full lg:aspect-square bg-primary rounded-r-2xl flex items-center justify-center">
        <div className="w-20 h-16 lg:w-12 lg:h-12 flex items-center justify-center">
          {/* <FileText className="size-6 lg:size-8 text-white" /> */}
          
          <LogoShape className="w-10 h-10" />
        </div>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden lg:block flex-1" />

      {/* Bottom section */}
      <div className="flex items-center gap-4 lg:flex-col lg:w-full lg:pb-6">
        <ThemeToggle />
        <div className="hidden lg:block w-full border-t border-slate-700 pt-6">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-medium">
              <img src="/nzube.png" alt="User" className="w-full h-full rounded-full object-cover" />
            </div>
          </div>
        </div>
        <div className="lg:hidden w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-medium">
          <img src="/nzube.png" alt="User" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>
    </aside>
  );
}
