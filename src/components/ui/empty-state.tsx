import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction, 
  className 
}: EmptyStateProps) => {
  return (
    <Card className={cn("glass-card p-12 text-center animate-fade-in", className)}>
      <div className="max-w-md mx-auto">
        {icon && (
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-medium/30 rounded-full">
              {icon}
            </div>
          </div>
        )}
        
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        
        {actionLabel && onAction && (
          <Button 
            className="btn-primary hover:scale-105 transition-all duration-200"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export { EmptyState };