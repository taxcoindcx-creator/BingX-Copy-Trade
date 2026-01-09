import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  subValue?: string;
  className?: string;
  delay?: number;
}

export function StatCard({ label, value, icon, trend, subValue, className, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn("glass-card p-4 rounded-2xl relative overflow-hidden", className)}
    >
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          {icon && <div className="text-primary/80">{icon}</div>}
        </div>
        
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-bold font-display tracking-tight text-foreground">
            {value}
          </h3>
        </div>

        {subValue && (
          <p className={cn(
            "text-xs font-medium mt-1 flex items-center gap-1",
            trend === "up" ? "text-[var(--success)]" : 
            trend === "down" ? "text-destructive" : "text-muted-foreground"
          )}>
            {subValue}
          </p>
        )}
      </div>
      
      {/* Decorative gradient blob */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
    </motion.div>
  );
}
