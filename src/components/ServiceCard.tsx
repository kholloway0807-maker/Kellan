import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function ServiceCard({ icon, title, description, className }: ServiceCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-cream-dark bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
        className
      )}
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green/10 text-green">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-bold text-green">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{description}</p>
    </div>
  );
}
