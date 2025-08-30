import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  Users, 
  Briefcase, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Star
} from "lucide-react";

interface AnalyticsData {
  totalApplications: number;
  totalInterviews: number;
  totalHires: number;
  totalCandidates: number;
  conversionRates: {
    applicationToInterview: number;
    interviewToHire: number;
    overallConversion: number;
  };
  positionAnalytics: {
    position: string;
    applications: number;
    interviews: number;
    hires: number;
    avgTimeToHire: number;
  }[];
  timeToHireData: {
    month: string;
    avgDays: number;
  }[];
  sourceAnalytics: {
    source: string;
    applications: number;
    percentage: number;
  }[];
}

const RecruitmentAnalytics = () => {
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState("3months");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API loading
    const loadAnalytics = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock analytics data
      setAnalyticsData({
        totalApplications: 456,
        totalInterviews: 123,
        totalHires: 38,
        totalCandidates: 342,
        conversionRates: {
          applicationToInterview: 27,
          interviewToHire: 31,
          overallConversion: 8.3
        },
        positionAnalytics: [
          {
            position: 'Software Engineer',
            applications: 185,
            interviews: 52,
            hires: 18,
            avgTimeToHire: 24
          },
          {
            position: 'Frontend Developer',
            applications: 142,
            interviews: 38,
            hires: 12,
            avgTimeToHire: 21
          },
          {
            position: 'Full Stack Developer',
            applications: 98,
            interviews: 28,
            hires: 6,
            avgTimeToHire: 28
          },
          {
            position: 'Backend Developer',
            applications: 31,
            interviews: 5,
            hires: 2,
            avgTimeToHire: 32
          }
        ],
        timeToHireData: [
          { month: 'Jan', avgDays: 28 },
          { month: 'Feb', avgDays: 25 },
          { month: 'Mar', avgDays: 22 },
          { month: 'Apr', avgDays: 26 },
          { month: 'May', avgDays: 24 },
          { month: 'Jun', avgDays: 23 }
        ],
        sourceAnalytics: [
          { source: 'University Portal', applications: 198, percentage: 43.4 },
          { source: 'LinkedIn', applications: 134, percentage: 29.4 },
          { source: 'Job Fairs', applications: 78, percentage: 17.1 },
          { source: 'Referrals', applications: 32, percentage: 7.0 },
          { source: 'Direct Applications', applications: 14, percentage: 3.1 }
        ]
      });
      setIsLoading(false);
    };

    loadAnalytics();
  }, [timeRange]);

  const handleExportReport = () => {
    toast({
      title: "Export Report",
      description: "Analytics report export functionality will be implemented here.",
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout 
        title="Recruitment Analytics" 
        subtitle="Analyze hiring performance and trends"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="loading-skeleton h-32 animate-pulse"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="loading-skeleton h-64 animate-pulse"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!analyticsData) return null;

  return (
    <DashboardLayout 
      title="Recruitment Analytics" 
      subtitle="Analyze hiring performance and trends"
    >
      <div className="space-y-6">
        {/* Header Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48 bg-purple-medium/50 border-border text-white">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-purple-medium border-border">
                <SelectItem value="1month" className="text-white">Last Month</SelectItem>
                <SelectItem value="3months" className="text-white">Last 3 Months</SelectItem>
                <SelectItem value="6months" className="text-white">Last 6 Months</SelectItem>
                <SelectItem value="1year" className="text-white">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleExportReport} variant="outline" className="text-white border-lime hover:bg-lime hover:text-purple-dark">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold text-white">{analyticsData.totalApplications}</p>
                <p className="text-green-400 text-sm">+12% vs last period</p>
              </div>
              <div className="bg-blue-500 rounded-full p-3">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interviews Conducted</p>
                <p className="text-2xl font-bold text-white">{analyticsData.totalInterviews}</p>
                <p className="text-green-400 text-sm">+8% vs last period</p>
              </div>
              <div className="bg-purple-500 rounded-full p-3">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Successful Hires</p>
                <p className="text-2xl font-bold text-white">{analyticsData.totalHires}</p>
                <p className="text-green-400 text-sm">+15% vs last period</p>
              </div>
              <div className="bg-green-500 rounded-full p-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unique Candidates</p>
                <p className="text-2xl font-bold text-white">{analyticsData.totalCandidates}</p>
                <p className="text-green-400 text-sm">+5% vs last period</p>
              </div>
              <div className="bg-orange-500 rounded-full p-3">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        {/* Conversion Rates */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-lime" />
            Conversion Rates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white">Application to Interview</span>
                <span className="text-lime font-semibold">{analyticsData.conversionRates.applicationToInterview}%</span>
              </div>
              <Progress value={analyticsData.conversionRates.applicationToInterview} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white">Interview to Hire</span>
                <span className="text-lime font-semibold">{analyticsData.conversionRates.interviewToHire}%</span>
              </div>
              <Progress value={analyticsData.conversionRates.interviewToHire} className="h-2" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white">Overall Conversion</span>
                <span className="text-lime font-semibold">{analyticsData.conversionRates.overallConversion}%</span>
              </div>
              <Progress value={analyticsData.conversionRates.overallConversion} className="h-2" />
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Position Analytics */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-lime" />
              Performance by Position
            </h3>
            <div className="space-y-4">
              {analyticsData.positionAnalytics.map((position, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">{position.position}</span>
                    <Badge variant="outline" className="text-white border-lime">
                      {position.hires} hires
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>Applications: {position.applications}</div>
                    <div>Interviews: {position.interviews}</div>
                    <div>Avg. Time: {position.avgTimeToHire} days</div>
                  </div>
                  <Progress 
                    value={(position.hires / position.applications) * 100} 
                    className="h-2" 
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Application Sources */}
          <Card className="glass-card p-6">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-lime" />
              Application Sources
            </h3>
            <div className="space-y-4">
              {analyticsData.sourceAnalytics.map((source, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white">{source.source}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">{source.applications}</span>
                      <Badge variant="outline" className="text-white border-lime">
                        {source.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={source.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Time to Hire Trend */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-lime" />
            Average Time to Hire Trend
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-muted-foreground">Monthly Average (Days)</span>
              <Badge variant="outline" className="text-white border-lime">
                Current: {analyticsData.timeToHireData[analyticsData.timeToHireData.length - 1]?.avgDays} days
              </Badge>
            </div>
            <div className="grid grid-cols-6 gap-4">
              {analyticsData.timeToHireData.map((data, index) => (
                <div key={index} className="text-center">
                  <div className="bg-purple-medium/50 rounded-lg p-4 mb-2">
                    <div className="text-xl font-semibold text-white">{data.avgDays}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{data.month}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Insights & Recommendations */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-lime" />
            Key Insights & Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Top Performing Areas</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Software Engineer positions show highest conversion rates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  University portal remains the best source for quality candidates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Time to hire has improved by 15% this quarter
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-white">Areas for Improvement</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-orange-500" />
                  Backend Developer positions need more targeted outreach
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-orange-500" />
                  Consider expanding referral program effectiveness
                </li>
                <li className="flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-orange-500" />
                  Interview-to-hire conversion could be optimized
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default RecruitmentAnalytics;