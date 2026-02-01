import { cn } from "@/lib/utils";

export function HexaVisionLogo({ className }: { className?: string }) {
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
        <path d="M17.25 4.5H6.75L2.25 12L6.75 19.5H17.25L21.75 12L17.25 4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.5 8.25L10.5 8.25C9.39543 8.25 8.5 9.14543 8.5 10.25V13.75C8.5 14.8546 9.39543 15.75 10.5 15.75L13.5 15.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10.5 12H15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
       </svg>
      <span className="font-headline text-lg font-bold text-foreground tracking-wide">
        Hexa Vision
      </span>
    </div>
  );
}
