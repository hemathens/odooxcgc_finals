import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { 
  Building, 
  CheckCircle, 
  Clock, 
  Users, 
  FileText, 
  Eye, 
  Edit, 
  Plus,
  Mail,
  Globe,
  MapPin,
  Calendar,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Company {
  id: string;
  name: string;
  email: string;
  website: string;
  location: string;
  industry: string;
  size: string;
  status: 'pending' | 'approved' | 'active' | 'suspended' | 'blacklisted';
  registrationDate: string;
  lastActivity: string;
  jobPostings: number;
  totalApplications: number;
  hires: number;
  contactPerson: {
    name: string;
    designation: string;
    email: string;
    phone: string;
  };
}

const statusOptions = [
  { value: 'pending', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'blacklisted', label: 'Blacklisted' }
];

const CompanyManagement = () => {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    const loadCompanies = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockCompanies: Company[] = [
        {
          id: '1',
          name: 'Tech Corp Solutions',
          email: 'hr@techcorp.com',
          website: 'https://techcorp.com',
          location: 'Bangalore, India',
          industry: 'Software Development',
          size: '500-1000',
          status: 'active',
          registrationDate: '2024-01-15',
          lastActivity: '2024-08-29',
          jobPostings: 8,
          totalApplications: 120,
          hires: 15,
          contactPerson: {
            name: 'Sarah Johnson',
            designation: 'HR Manager',
            email: 'sarah.j@techcorp.com',
            phone: '+91 9876543210'
          }
        },
        {
          id: '2',
          name: 'StartupXYZ',
          email: 'recruitment@startupxyz.com',
          website: 'https://startupxyz.com',
          location: 'Mumbai, India',
          industry: 'Fintech',
          size: '50-100',
          status: 'approved',
          registrationDate: '2024-02-20',
          lastActivity: '2024-08-28',
          jobPostings: 5,
          totalApplications: 75,
          hires: 8,
          contactPerson: {
            name: 'Raj Patel',
            designation: 'Talent Acquisition Lead',
            email: 'raj.p@startupxyz.com',
            phone: '+91 9876543211'
          }
        },
        {
          id: '3',
          name: 'BigTech Industries',
          email: 'campus@bigtech.com',
          website: 'https://bigtech.com',
          location: 'Hyderabad, India',
          industry: 'Enterprise Software',
          size: '1000+',
          status: 'pending',
          registrationDate: '2024-08-25',
          lastActivity: '2024-08-30',
          jobPostings: 0,
          totalApplications: 0,
          hires: 0,
          contactPerson: {
            name: 'Michael Chen',
            designation: 'Campus Relations Manager',
            email: 'michael.c@bigtech.com',
            phone: '+91 9876543212'
          }
        },
        {
          id: '4',
          name: 'InnovateLabs',
          email: 'hiring@innovatelabs.com',
          website: 'https://innovatelabs.com',
          location: 'Pune, India',
          industry: 'AI/ML',
          size: '100-500',
          status: 'active',
          registrationDate: '2024-03-10',
          lastActivity: '2024-08-27',
          jobPostings: 12,
          totalApplications: 200,
          hires: 25,
          contactPerson: {
            name: 'Priya Sharma',
            designation: 'Head of Recruitment',
            email: 'priya.s@innovatelabs.com',
            phone: '+91 9876543213'
          }
        }
      ];
      
      setCompanies(mockCompanies);
      setFilteredCompanies(mockCompanies);
      setIsLoading(false);
    };

    loadCompanies();
  }, []);

  useEffect(() => {
    let filtered = companies;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilters.length > 0) {
      filtered = filtered.filter(company =>
        statusFilters.includes(company.status)
      );
    }

    setFilteredCompanies(filtered);
  }, [companies, searchTerm, statusFilters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'suspended': return 'bg-orange-500';
      case 'blacklisted': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const updateCompanyStatus = (companyId: string, newStatus: Company['status']) => {
    setCompanies(companies.map(company => 
      company.id === companyId 
        ? { ...company, status: newStatus }
        : company
    ));
    
    toast({
      title: "Status Updated",
      description: "Company status has been updated successfully.",
    });
  };

  const stats = {
    total: companies.length,
    pending: companies.filter(c => c.status === 'pending').length,
    active: companies.filter(c => c.status === 'active').length,
    approved: companies.filter(c => c.status === 'approved').length
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Company Management" subtitle="Manage company partnerships and registrations">
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
    <DashboardLayout title="Company Management" subtitle="Manage company partnerships and registrations">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Building className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-muted-foreground">Total Companies</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-500/20 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                <p className="text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
                <p className="text-muted-foreground">Active Partners</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-lime/20 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-lime" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.approved}</p>
                <p className="text-muted-foreground">Approved</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Company Partnerships</h3>
              <p className="text-muted-foreground">Review and manage company registrations</p>
            </div>
            <Button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>

          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilters.join(',')}
            onStatusFilterChange={(value) => setStatusFilters(value ? [value] : [])}
            filterOptions={statusOptions}
            placeholder="Search companies by name, industry, or location..."
          />
        </Card>

        {/* Company List */}
        <Card className="glass-card p-6">
          <div className="space-y-6">
            {filteredCompanies.map((company) => (
              <div key={company.id} className="bg-purple-medium/30 p-6 rounded-lg hover:bg-purple-medium/40 transition-all duration-200">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-xl font-semibold text-white">{company.name}</h4>
                      <Badge className={`${getStatusColor(company.status)} text-white`}>
                        {company.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {company.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {company.website}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {company.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        {company.industry} • {company.size} employees
                      </div>
                    </div>

                    <div className="bg-purple-light/10 p-4 rounded-lg mb-4">
                      <h5 className="text-white font-medium mb-2">Contact Person</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div>{company.contactPerson.name} • {company.contactPerson.designation}</div>
                        <div>{company.contactPerson.email}</div>
                        <div>{company.contactPerson.phone}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-lime font-semibold">{company.jobPostings}</div>
                        <div className="text-muted-foreground">Job Posts</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-semibold">{company.totalApplications}</div>
                        <div className="text-muted-foreground">Applications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-semibold">{company.hires}</div>
                        <div className="text-muted-foreground">Hires</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 xl:min-w-64">
                    <div className="flex gap-2">
                      <Button size="sm" className="btn-secondary flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-purple-medium/50">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {company.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateCompanyStatus(company.id, 'approved')}
                          className="bg-green-500/20 text-green-400 hover:bg-green-500/30 flex-1"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => updateCompanyStatus(company.id, 'blacklisted')}
                          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 flex-1"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    
                    {company.status === 'approved' && (
                      <Button 
                        size="sm" 
                        onClick={() => updateCompanyStatus(company.id, 'active')}
                        className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 w-full"
                      >
                        Activate Partnership
                      </Button>
                    )}

                    {company.status === 'active' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateCompanyStatus(company.id, 'suspended')}
                          className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 flex-1"
                        >
                          Suspend
                        </Button>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground text-center">
                      Registered: {new Date(company.registrationDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredCompanies.length === 0 && (
              <div className="text-center py-12">
                <Building className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Companies Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilters.length > 0 
                    ? "Try adjusting your search or filters"
                    : "No companies have registered yet"
                  }
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CompanyManagement;