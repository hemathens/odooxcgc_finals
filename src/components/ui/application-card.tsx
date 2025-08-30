import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building, 
  MapPin, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Eye, 
  Edit,
  DollarSign 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Application {
  id: string;
  company: string;
  position: string;
  location: string;
  appliedDate: string;
  deadline?: string;
  status: 'applied' | 'in-review' | 'interview-scheduled' | 'interviewed' | 'selected' | 'rejected' | 'withdrawn';
  nextStep?: string;
  notes?: string;
  jobUrl?: string;
  salary?: string;
}

interface ApplicationCardProps {
  application: Application;
  delay?: number;
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
  onViewJob?: (url: string) => void;
}

const ApplicationCard = ({ 
  application, 
  delay = 0, 
  onViewDetails, 
  onEdit, 
  onViewJob 
}: ApplicationCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-500';
      case 'in-review': return 'bg-yellow-500';
      case 'interview-scheduled': return 'bg-purple-500';
      case 'interviewed': return 'bg-orange-500';
      case 'selected': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      case 'withdrawn': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'interview-scheduled': return 'Interview Scheduled';
      case 'in-review': return 'In Review';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Card 
      className={cn(
        "glass-card p-6 hover:bg-purple-medium/20 transition-all duration-300 animate-fade-in hover:scale-[1.02] hover:shadow-lg"
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Main Info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">{application.position}</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="w-4 h-4" />
                <span>{application.company}</span>
              </div>
            </div>
            <Badge className={cn(getStatusColor(application.status), "text-white animate-scale-in")}>
              {getStatusLabel(application.status)}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{application.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Applied: {new Date(application.appliedDate).toLocaleDateString()}</span>
            </div>
            {application.deadline && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Deadline: {new Date(application.deadline).toLocaleDateString()}</span>
              </div>
            )}
            {application.salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>{application.salary}</span>
              </div>
            )}
          </div>

          {application.nextStep && (
            <div className="bg-lime/10 border border-lime/20 rounded-lg p-3 mb-3 animate-slide-up">
              <p className="text-lime font-medium text-sm">Next Step: {application.nextStep}</p>
            </div>
          )}

          {application.notes && (
            <div className="bg-purple-medium/30 rounded-lg p-3 animate-slide-up">
              <p className="text-white text-sm">{application.notes}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {application.jobUrl && onViewJob && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-purple-medium/50 transition-all duration-200 hover:scale-105"
              onClick={() => onViewJob(application.jobUrl!)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Job
            </Button>
          )}
          {onViewDetails && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-purple-medium/50 transition-all duration-200 hover:scale-105"
              onClick={() => onViewDetails(application.id)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Details
            </Button>
          )}
          {onEdit && (
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-white hover:bg-purple-medium/50 transition-all duration-200 hover:scale-105"
              onClick={() => onEdit(application.id)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export { ApplicationCard };