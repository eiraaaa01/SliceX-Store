import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
       <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        <path
          d="M12 2L3 7V17L12 22L21 17V7L12 2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 12L3 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
         <path
          d="M12 12L21 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
         <path
          d="M12 12V22"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
         <path
          d="M16.5 9.5L7.5 14.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
         />
      </svg>
      <span className="font-headline text-xl font-bold text-foreground tracking-wide">
        Hexa Vision
      </span>
    </div>
  );
}
