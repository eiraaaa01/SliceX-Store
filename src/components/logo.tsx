import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
       <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
       >
        <path d="M16.8928 2.36364L8.98863 6.31818C7.99419 6.81539 7.497 7.06399 7.15572 7.42617C6.81444 7.78835 6.66319 8.24949 6.36069 9.17177L4.75 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.10718 21.6364L15.0114 17.6818C16.0058 17.1846 16.503 16.936 16.8443 16.5738C17.1856 16.2116 17.3368 15.7505 17.6393 14.8282L19.25 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
       </svg>
      <span className="font-headline text-lg font-bold text-foreground tracking-wide">
        SliceX Store
      </span>
    </div>
  );
}
