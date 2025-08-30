import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
  delay?: number;
}

const StatCard = ({ title, value, icon, trend, className, delay = 0 }: StatCardProps) => {
  return (
    <Card 
      className={cn(
        "glass-card p-6 animate-fade-in hover:scale-105 transition-all duration-300",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="bg-lime/20 p-3 rounded-xl">
          {icon}
        </div>
        {trend && (
          <div className={cn(
            "text-sm font-medium",
            trend.value > 0 ? "text-green-400" : "text-red-400"
          )}>
            {trend.value > 0 ? "+" : ""}{trend.value}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-muted-foreground text-sm">{title}</p>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">{trend.label}</p>
        )}
      </div>
    </Card>
  );
};

export { StatCard };