import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Filter, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onAddNew?: () => void;
  className?: string;
  placeholder?: string;
  filterOptions?: { value: string; label: string }[];
}

const defaultFilterOptions = [
  { value: "all", label: "All Status" },
  { value: "applied", label: "Applied" },
  { value: "in-review", label: "In Review" },
  { value: "interview-scheduled", label: "Interview Scheduled" },
  { value: "interviewed", label: "Interviewed" },
  { value: "selected", label: "Selected" },
  { value: "rejected", label: "Rejected" },
];

const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onAddNew,
  className,
  placeholder = "Search...",
  filterOptions = defaultFilterOptions
}: SearchFilterBarProps) => {
  const clearSearch = () => onSearchChange("");
  const clearFilter = () => onStatusFilterChange("all");

  return (
    <Card className={cn("glass-card p-6 animate-fade-in", className)}>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-purple-medium/50 border-border text-white placeholder:text-muted-foreground focus:border-lime transition-colors"
            />
            {searchTerm && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-white"
                onClick={clearSearch}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="appearance-none px-4 py-2 pr-8 bg-purple-medium/50 border border-border rounded-lg text-white focus:border-lime transition-colors cursor-pointer"
            >
              {filterOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-purple-dark">
                  {option.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            {statusFilter !== "all" && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute -right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-white"
                onClick={clearFilter}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>

        {/* Add New Button */}
        {onAddNew && (
          <Button 
            className="btn-primary hover:scale-105 transition-all duration-200"
            onClick={onAddNew}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {(searchTerm || statusFilter !== "all") && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/20">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {searchTerm && (
            <div className="flex items-center gap-1 bg-lime/20 text-lime px-2 py-1 rounded-md text-xs">
              <span>Search: "{searchTerm}"</span>
              <button onClick={clearSearch} className="hover:text-lime-dark">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
          {statusFilter !== "all" && (
            <div className="flex items-center gap-1 bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md text-xs">
              <span>Status: {filterOptions.find(opt => opt.value === statusFilter)?.label}</span>
              <button onClick={clearFilter} className="hover:text-purple-200">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export { SearchFilterBar };