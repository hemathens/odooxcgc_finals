import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchFilterBar } from "@/components/ui/search-filter-bar";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Download, 
  Eye, 
  Edit, 
  Filter,
  Plus,
  Mail,
  Phone,
  Calendar,
  Award
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  cgpa: number;
  status: 'active' | 'placed' | 'inactive' | 'blacklisted';
  applications: number;
  interviews: number;
  offers: number;
  joinedDate: string;
  lastActivity: string;
  skills: string[];
  resumeUrl?: string;
}

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'placed', label: 'Placed' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'blacklisted', label: 'Blacklisted' }
];

const StudentManagement = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data loading
    const loadStudents = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@university.edu',
          phone: '+91 9876543210',
          course: 'Computer Science',
          cgpa: 8.5,
          status: 'active',
          applications: 12,
          interviews: 5,
          offers: 2,
          joinedDate: '2021-08-15',
          lastActivity: '2024-08-29',
          skills: ['React', 'Node.js', 'Python', 'MongoDB']
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@university.edu',
          phone: '+91 9876543211',
          course: 'Information Technology',
          cgpa: 9.2,
          status: 'placed',
          applications: 8,
          interviews: 6,
          offers: 3,
          joinedDate: '2021-08-15',
          lastActivity: '2024-08-28',
          skills: ['Java', 'Spring Boot', 'MySQL', 'React']
        },
        {
          id: '3',
          name: 'Bob Johnson',
          email: 'bob.johnson@university.edu',
          phone: '+91 9876543212',
          course: 'Software Engineering',
          cgpa: 7.8,
          status: 'active',
          applications: 15,
          interviews: 3,
          offers: 0,
          joinedDate: '2021-08-15',
          lastActivity: '2024-08-27',
          skills: ['Angular', 'TypeScript', 'PostgreSQL']
        },
        {
          id: '4',
          name: 'Alice Brown',
          email: 'alice.brown@university.edu',
          phone: '+91 9876543213',
          course: 'Data Science',
          cgpa: 9.5,
          status: 'active',
          applications: 20,
          interviews: 8,
          offers: 4,
          joinedDate: '2021-08-15',
          lastActivity: '2024-08-30',
          skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL']
        }
      ];
      
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      setIsLoading(false);
    };

    loadStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilters.length > 0) {
      filtered = filtered.filter(student =>
        statusFilters.includes(student.status)
      );
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, statusFilters]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'placed': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'blacklisted': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const updateStudentStatus = (studentId: string, newStatus: Student['status']) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, status: newStatus }
        : student
    ));
    
    toast({
      title: "Status Updated",
      description: "Student status has been updated successfully.",
    });
  };

  const exportStudentData = () => {
    toast({
      title: "Export Started",
      description: "Student data export is being prepared...",
    });
  };

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === 'active').length,
    placed: students.filter(s => s.status === 'placed').length,
    inactive: students.filter(s => s.status === 'inactive').length
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Student Management" subtitle="Manage student records and placement status">
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
    <DashboardLayout title="Student Management" subtitle="Manage student records and placement status">
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
                <p className="text-muted-foreground">Total Students</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-3 rounded-xl">
                <UserCheck className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.placed}</p>
                <p className="text-muted-foreground">Placed</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-lime/20 p-3 rounded-xl">
                <Award className="w-6 h-6 text-lime" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
                <p className="text-muted-foreground">Active</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-6">
            <div className="flex items-center gap-3">
              <div className="bg-gray-500/20 p-3 rounded-xl">
                <UserX className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stats.inactive}</p>
                <p className="text-muted-foreground">Inactive</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <Card className="glass-card p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-white">Student Records</h3>
              <p className="text-muted-foreground">Manage and monitor student placement activities</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={exportStudentData} className="btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>

          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilters.join(',')}
            onStatusFilterChange={(value) => setStatusFilters(value ? [value] : [])}
            filterOptions={statusOptions}
            placeholder="Search students by name, email, or course..."
          />
        </Card>

        {/* Student List */}
        <Card className="glass-card p-6">
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="bg-purple-medium/30 p-6 rounded-lg hover:bg-purple-medium/40 transition-all duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{student.name}</h4>
                      <Badge className={`${getStatusColor(student.status)} text-white`}>
                        {student.status}
                      </Badge>
                      <Badge className="bg-lime/20 text-lime">
                        CGPA: {student.cgpa}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {student.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {student.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        {student.course}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {student.skills.slice(0, 4).map((skill) => (
                        <Badge key={skill} className="bg-purple-light/20 text-purple-light text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {student.skills.length > 4 && (
                        <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                          +{student.skills.length - 4} more
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                      <div className="text-center">
                        <div className="text-lime font-semibold">{student.applications}</div>
                        <div className="text-muted-foreground">Applications</div>
                      </div>
                      <div className="text-center">
                        <div className="text-blue-400 font-semibold">{student.interviews}</div>
                        <div className="text-muted-foreground">Interviews</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-400 font-semibold">{student.offers}</div>
                        <div className="text-muted-foreground">Offers</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 lg:min-w-48">
                    <div className="flex gap-2">
                      <Button size="sm" className="btn-secondary flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View Profile
                      </Button>
                      <Button size="sm" variant="ghost" className="text-white hover:bg-purple-medium/50">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex gap-2">
                      {student.status === 'active' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateStudentStatus(student.id, 'placed')}
                          className="bg-green-500/20 text-green-400 hover:bg-green-500/30 flex-1"
                        >
                          Mark Placed
                        </Button>
                      )}
                      {student.status === 'placed' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateStudentStatus(student.id, 'active')}
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 flex-1"
                        >
                          Mark Active
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No Students Found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilters.length > 0 
                    ? "Try adjusting your search or filters"
                    : "No students have been added yet"
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

export default StudentManagement;