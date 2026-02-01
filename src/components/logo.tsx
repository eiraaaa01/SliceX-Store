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
        <path d="M2.5 10.5C2.5 5.52944 6.52944 1.5 11.5 1.5C16.4706 1.5 20.5 5.52944 20.5 10.5C20.5 15.4706 17 21.5 11.5 21.5C6 21.5 2.5 15.4706 2.5 10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M11.5 1.5L21.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
       </svg>
      <span className="font-headline text-lg font-bold text-foreground tracking-wide">
        Slice Store
      </span>
    </div>
  );
}
