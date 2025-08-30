import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  Users, 
  Building, 
  Award, 
  Download, 
  Calendar,
  DollarSign,
  Target,
  BarChart3,
  PieChart,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlacementStats {
  totalStudents: number;
  placedStudents: number;
  totalOffers: number;
  averagePackage: number;
  highestPackage: number;
  placementRate: number;
  companiesVisited: number;
  ongoingDrives: number;
}

interface CompanyPlacement {
  companyName: string;
  placedStudents: number;
  averagePackage: number;
  highestPackage: number;
  positions: string[];
}

interface CourseAnalytics {
  course: string;
  totalStudents: number;
  placedStudents: number;
  placementRate: number;
  averagePackage: number;
}

interface MonthlyTrend {
  month: string;
  placements: number;
  applications: number;
  offers: number;
}

const PlacementReports = () => {
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState("2024");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState<PlacementStats>({
    totalStudents: 0,
    placedStudents: 0,
    totalOffers: 0,
    averagePackage: 0,
    highestPackage: 0,
    placementRate: 0,
    companiesVisited: 0,
    ongoingDrives: 0
  });

  const [companyPlacements, setCompanyPlacements] = useState<CompanyPlacement[]>([]);
  const [courseAnalytics, setCourseAnalytics] = useState<CourseAnalytics[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);

  useEffect(() => {
    const loadReportData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Mock data
      setStats({
        totalStudents: 450,
        placedStudents: 287,
        totalOffers: 324,
        averagePackage: 8.5,
        highestPackage: 45.0,
        placementRate: 63.8,
        companiesVisited: 85,
        ongoingDrives: 12
      });

      setCompanyPlacements([
        {
          companyName: "Tech Corp Solutions",
          placedStudents: 25,
          averagePackage: 12.5,
          highestPackage: 18.0,
          positions: ["Software Engineer", "Frontend Developer", "Data Analyst"]
        },
        {
          companyName: "InnovateLabs",
          placedStudents: 32,
          averagePackage: 15.2,
          highestPackage: 25.0,
          positions: ["ML Engineer", "Backend Developer", "DevOps Engineer"]
        },
        {
          companyName: "BigTech Industries",
          placedStudents: 18,
          averagePackage: 22.8,
          highestPackage: 45.0,
          positions: ["Senior SDE", "Product Manager", "System Architect"]
        },
        {
          companyName: "StartupXYZ",
          placedStudents: 15,
          averagePackage: 9.8,
          highestPackage: 14.0,
          positions: ["Full Stack Developer", "UI/UX Designer"]
        },
        {
          companyName: "FinanceFlow",
          placedStudents: 22,
          averagePackage: 11.5,
          highestPackage: 16.5,
          positions: ["Software Developer", "Business Analyst", "QA Engineer"]
        }
      ]);

      setCourseAnalytics([
        {
          course: "Computer Science",
          totalStudents: 120,
          placedStudents: 85,
          placementRate: 70.8,
          averagePackage: 10.2
        },
        {
          course: "Information Technology",
          totalStudents: 100,
          placedStudents: 68,
          placementRate: 68.0,
          averagePackage: 9.8
        },
        {
          course: "Software Engineering",
          totalStudents: 80,
          placedStudents: 52,
          placementRate: 65.0,
          averagePackage: 9.5
        },
        {
          course: "Data Science",
          totalStudents: 90,
          placedStudents: 62,
          placementRate: 68.9,
          averagePackage: 11.8
        },
        {
          course: "Artificial Intelligence",
          totalStudents: 60,
          placedStudents: 20,
          placementRate: 33.3,
          averagePackage: 13.5
        }
      ]);

      setMonthlyTrends([
        { month: "Jan", placements: 12, applications: 145, offers: 18 },
        { month: "Feb", placements: 25, applications: 189, offers: 32 },
        { month: "Mar", placements: 35, applications: 234, offers: 45 },
        { month: "Apr", placements: 28, applications: 178, offers: 38 },
        { month: "May", placements: 45, applications: 267, offers: 58 },
        { month: "Jun", placements: 52, applications: 298, offers: 68 },
        { month: "Jul", placements: 38, applications: 203, offers: 48 },
        { month: "Aug", placements: 52, applications: 312, offers: 67 }
      ]);

      setIsLoading(false);
    };

    loadReportData();
  }, [selectedYear, selectedCourse]);

  const exportReport = (type: string) => {
    toast({
      title: "Export Started",
      description: `${type} report is being generated...`,
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Placement Reports" subtitle="Analytics and insights on placement performance">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="loading-skeleton h-24 animate-pulse"></div>
            ))}
          </div>
          <div className="loading-skeleton h-96 animate-pulse"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Placement Reports" subtitle="Analytics and insights on placement performance">
      <div className="space-y-6">
        {/* Controls */}
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">Placement Analytics</h3>
              <p className="text-muted-foreground">Comprehensive placement performance insights</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-40 bg-purple-medium/50 border-border text-white">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent className="bg-purple-medium border-border">
                  <SelectItem value="2024" className="text-white hover:bg-purple-light">2024</SelectItem>
                  <SelectItem value="2023" className="text-white hover:bg-purple-light">2023</SelectItem>
                  <SelectItem value="2022" className="text-white hover:bg-purple-light">2022</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-48 bg-purple-medium/50 border-border text-white">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent className="bg-purple-medium border-border">
                  <SelectItem value="all" className="text-white hover:bg-purple-light">All Courses</SelectItem>
                  <SelectItem value="cs" className="text-white hover:bg-purple-light">Computer Science</SelectItem>
                  <SelectItem value="it" className="text-white hover:bg-purple-light">Information Technology</SelectItem>
                  <SelectItem value="se" className="text-white hover:bg-purple-light">Software Engineering</SelectItem>
                  <SelectItem value="ds" className="text-white hover:bg-purple-light">Data Science</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => exportReport('Comprehensive')} className="btn-primary">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-lime/20 p-3 rounded-xl">
                <Target className="w-6 h-6 text-lime" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.placementRate}%</p>
                <p className="text-muted-foreground">Placement Rate</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <Users className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.placedStudents}</p>
                <p className="text-muted-foreground">Students Placed</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">₹{stats.averagePackage}L</p>
                <p className="text-muted-foreground">Average Package</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">₹{stats.highestPackage}L</p>
                <p className="text-muted-foreground">Highest Package</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card p-6 text-center">
            <Building className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.companiesVisited}</div>
            <div className="text-muted-foreground">Companies Visited</div>
          </Card>

          <Card className="glass-card p-6 text-center">
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.totalOffers}</div>
            <div className="text-muted-foreground">Total Offers</div>
          </Card>

          <Card className="glass-card p-6 text-center">
            <Calendar className="w-8 h-8 text-pink-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats.ongoingDrives}</div>
            <div className="text-muted-foreground">Ongoing Drives</div>
          </Card>

          <Card className="glass-card p-6 text-center">
            <TrendingUp className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{Math.round((stats.totalOffers / stats.placedStudents) * 100) / 100}</div>
            <div className="text-muted-foreground">Offers per Student</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Company-wise Placements */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Top Recruiting Companies</h3>
              <Button size="sm" onClick={() => exportReport('Company-wise')} className="btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="space-y-4">
              {companyPlacements.map((company, index) => (
                <div key={company.companyName} className="bg-purple-medium/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-lime/20 text-lime w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <h4 className="font-semibold text-white">{company.companyName}</h4>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      {company.placedStudents} placed
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Avg Package: </span>
                      <span className="text-blue-400 font-semibold">₹{company.averagePackage}L</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Highest: </span>
                      <span className="text-green-400 font-semibold">₹{company.highestPackage}L</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {company.positions.map((position) => (
                      <Badge key={position} className="bg-purple-light/20 text-purple-light text-xs">
                        {position}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Course-wise Analytics */}
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Course-wise Performance</h3>
              <Button size="sm" onClick={() => exportReport('Course-wise')} className="btn-secondary">
                <PieChart className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
            <div className="space-y-4">
              {courseAnalytics.map((course) => (
                <div key={course.course} className="bg-purple-medium/30 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{course.course}</h4>
                    <Badge className={`${course.placementRate > 65 ? 'bg-green-500' : course.placementRate > 50 ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                      {course.placementRate}%
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-blue-400 font-semibold">{course.totalStudents}</div>
                      <div className="text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-green-400 font-semibold">{course.placedStudents}</div>
                      <div className="text-muted-foreground">Placed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lime font-semibold">₹{course.averagePackage}L</div>
                      <div className="text-muted-foreground">Avg Package</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Monthly Placement Trends</h3>
            <Button size="sm" onClick={() => exportReport('Monthly Trends')} className="btn-secondary">
              <BarChart3 className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            {monthlyTrends.map((trend) => (
              <div key={trend.month} className="bg-purple-medium/30 p-4 rounded-lg text-center">
                <div className="text-lime font-bold text-lg">{trend.month}</div>
                <div className="space-y-2 mt-2 text-sm">
                  <div>
                    <div className="text-green-400 font-semibold">{trend.placements}</div>
                    <div className="text-muted-foreground">Placed</div>
                  </div>
                  <div>
                    <div className="text-blue-400 font-semibold">{trend.applications}</div>
                    <div className="text-muted-foreground">Applications</div>
                  </div>
                  <div>
                    <div className="text-purple-400 font-semibold">{trend.offers}</div>
                    <div className="text-muted-foreground">Offers</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Export Options */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Advanced Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => exportReport('Detailed Analytics')} 
              className="btn-secondary justify-start h-auto p-4"
            >
              <FileText className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Detailed Analytics Report</div>
                <div className="text-sm opacity-80">Complete placement insights with trends</div>
              </div>
            </Button>

            <Button 
              onClick={() => exportReport('Student Performance')} 
              className="btn-secondary justify-start h-auto p-4"
            >
              <Users className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Student Performance Report</div>
                <div className="text-sm opacity-80">Individual student placement data</div>
              </div>
            </Button>

            <Button 
              onClick={() => exportReport('Company Analysis')} 
              className="btn-secondary justify-start h-auto p-4"
            >
              <Building className="w-5 h-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Company Analysis Report</div>
                <div className="text-sm opacity-80">Recruiting partner performance</div>
              </div>
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PlacementReports;