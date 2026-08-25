import { cn } from "@/lib/utils";

interface FabricMarkProps {
  className?: string;
}

export function FabricMark({ className }: FabricMarkProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" className={cn("h-8 w-8", className)} fill="none">
      <defs>
        <linearGradient
          id="fabric-mark-a"
          x1="7"
          y1="4"
          x2="34"
          y2="34"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0F6CBD" />
          <stop offset="0.42" stopColor="#00B7C3" />
          <stop offset="0.72" stopColor="#7F4FC9" />
          <stop offset="1" stopColor="#E84A8A" />
        </linearGradient>
        <linearGradient
          id="fabric-mark-b"
          x1="31"
          y1="6"
          x2="8"
          y2="33"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8E5BE8" />
          <stop offset="0.48" stopColor="#26C6DA" />
          <stop offset="1" stopColor="#0F6CBD" />
        </linearGradient>
      </defs>
      <path
        d="M11 31V13.5C11 8.8 14.8 5 19.5 5S28 8.8 28 13.5v13"
        stroke="url(#fabric-mark-a)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M8 12h11.5C26.4 12 32 17.6 32 24.5S26.4 37 19.5 37H15"
        stroke="url(#fabric-mark-b)"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
