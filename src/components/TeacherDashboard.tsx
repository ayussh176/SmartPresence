import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  LogOut, 
  Play, 
  Square, 
  Settings, 
  BarChart3, 
  User,
  Monitor,
  MapPin,
  Link as LinkIcon
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock data - Enhanced with class-wise student organization
const mockClassData = {
  "Data Structures": {
    className: "CS-A Morning",
    students: [
      { 
        id: 1, 
        name: "John Doe", 
        rollNumber: "CS2021001", 
        attendance: 85,
        dailyAttendance: [
          { date: "2024-01-15", status: "present" },
          { date: "2024-01-16", status: "present" },
          { date: "2024-01-17", status: "absent" },
          { date: "2024-01-18", status: "present" },
          { date: "2024-01-19", status: "present" },
        ]
      },
      { 
        id: 2, 
        name: "Jane Smith", 
        rollNumber: "CS2021002", 
        attendance: 92,
        dailyAttendance: [
          { date: "2024-01-15", status: "present" },
          { date: "2024-01-16", status: "present" },
          { date: "2024-01-17", status: "present" },
          { date: "2024-01-18", status: "present" },
          { date: "2024-01-19", status: "absent" },
        ]
      },
      { 
        id: 3, 
        name: "Mike Johnson", 
        rollNumber: "CS2021003", 
        attendance: 67,
        dailyAttendance: [
          { date: "2024-01-15", status: "absent" },
          { date: "2024-01-16", status: "present" },
          { date: "2024-01-17", status: "absent" },
          { date: "2024-01-18", status: "present" },
          { date: "2024-01-19", status: "present" },
        ]
      },
    ]
  },
  "Database Management": {
    className: "CS-B Evening", 
    students: [
      { 
        id: 4, 
        name: "Sarah Wilson", 
        rollNumber: "CS2021004", 
        attendance: 78,
        dailyAttendance: [
          { date: "2024-01-15", status: "present" },
          { date: "2024-01-16", status: "absent" },
          { date: "2024-01-17", status: "present" },
          { date: "2024-01-18", status: "present" },
          { date: "2024-01-19", status: "present" },
        ]
      },
      { 
        id: 5, 
        name: "David Brown", 
        rollNumber: "CS2021005", 
        attendance: 95,
        dailyAttendance: [
          { date: "2024-01-15", status: "present" },
          { date: "2024-01-16", status: "present" },
          { date: "2024-01-17", status: "present" },
          { date: "2024-01-18", status: "present" },
          { date: "2024-01-19", status: "present" },
        ]
      },
    ]
  },
  "Operating Systems": {
    className: "CS-C Afternoon",
    students: [
      { 
        id: 6, 
        name: "Lisa Davis", 
        rollNumber: "CS2021006", 
        attendance: 72,
        dailyAttendance: [
          { date: "2024-01-15", status: "present" },
          { date: "2024-01-16", status: "absent" },
          { date: "2024-01-17", status: "absent" },
          { date: "2024-01-18", status: "present" },
          { date: "2024-01-19", status: "present" },
        ]
      },
    ]
  }
};

const mockTeacherData = {
  name: "Dr. Smith",
  subjects: ["Data Structures", "Database Management", "Operating Systems"],
};

const TeacherDashboard = () => {
  const [currentView, setCurrentView] = useState<"main" | "class-setup" | "active-class" | "analytics" | "student-list" | "student-detail">("main");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [classData, setClassData] = useState({
    mode: "",
    className: "",
    subject: "",
    roomNumber: "",
    meetingLink: "",
  });
  const [isClassActive, setIsClassActive] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartClass = () => {
    if (!classData.mode || !classData.className || !classData.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (classData.mode === "offline" && !classData.roomNumber) {
      toast({
        title: "Missing Room Number",
        description: "Please provide room number for offline class",
        variant: "destructive",
      });
      return;
    }

    if (classData.mode === "online" && !classData.meetingLink) {
      toast({
        title: "Missing Meeting Link",
        description: "Please provide meeting link for online class",
        variant: "destructive",
      });
      return;
    }

    setIsClassActive(true);
    setCurrentView("active-class");
    toast({
      title: "Class Started",
      description: `${classData.subject} class has been started`,
    });
  };

  const handleEndClass = () => {
    setIsClassActive(false);
    setCurrentView("main");
    toast({
      title: "Class Ended",
      description: "Attendance has been recorded",
    });
  };

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
    setCurrentView("student-list");
  };

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student);
    setCurrentView("student-detail");
  };

  const toggleAttendance = (studentId: number, newStatus: "present" | "absent") => {
    // This would update the backend in a real application
    toast({
      title: "Attendance Updated",
      description: `Student attendance has been marked as ${newStatus}`,
    });
  };

  const overrideStudentAttendance = (date: string, status: "present" | "absent") => {
    if (!selectedStudent) return;
    
    // Update the student's attendance for the specific date
    const updatedDailyAttendance = selectedStudent.dailyAttendance.map((record: any) =>
      record.date === date ? { ...record, status } : record
    );
    
    // Calculate new overall attendance percentage
    const presentCount = updatedDailyAttendance.filter((record: any) => record.status === "present").length;
    const newAttendance = Math.round((presentCount / updatedDailyAttendance.length) * 100);
    
    // Update the student object
    const updatedStudent = {
      ...selectedStudent,
      dailyAttendance: updatedDailyAttendance,
      attendance: newAttendance
    };
    
    setSelectedStudent(updatedStudent);
    
    toast({
      title: "Attendance Override",
      description: `Attendance updated for ${date}`,
    });
  };

  if (currentView === "class-setup") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentView("main")}>
              ← Back
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Start New Class</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Teaching Mode</Label>
                <Select value={classData.mode} onValueChange={(value) => setClassData(prev => ({ ...prev, mode: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select teaching mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        Online
                      </div>
                    </SelectItem>
                    <SelectItem value="offline">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Offline
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="className">Class Name</Label>
                  <Input
                    id="className"
                    placeholder="e.g., CS-A Morning"
                    value={classData.className}
                    onChange={(e) => setClassData(prev => ({ ...prev, className: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Select value={classData.subject} onValueChange={(value) => setClassData(prev => ({ ...prev, subject: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTeacherData.subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {classData.mode === "offline" && (
                <div className="space-y-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input
                    id="roomNumber"
                    placeholder="e.g., Room 101"
                    value={classData.roomNumber}
                    onChange={(e) => setClassData(prev => ({ ...prev, roomNumber: e.target.value }))}
                  />
                </div>
              )}

              {classData.mode === "online" && (
                <div className="space-y-2">
                  <Label htmlFor="meetingLink">Meeting Link</Label>
                  <Input
                    id="meetingLink"
                    placeholder="e.g., https://meet.google.com/..."
                    value={classData.meetingLink}
                    onChange={(e) => setClassData(prev => ({ ...prev, meetingLink: e.target.value }))}
                  />
                </div>
              )}

              <Button onClick={handleStartClass} className="w-full bg-gradient-primary">
                <Play className="mr-2 h-4 w-4" />
                Start Class
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === "active-class") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              <div>
                <h1 className="text-xl font-bold">Class in Progress</h1>
                <p className="text-muted-foreground">{classData.subject} - {classData.className}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/")}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <Button onClick={handleEndClass} variant="destructive">
                <Square className="mr-2 h-4 w-4" />
                End Class
              </Button>
            </div>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Class Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gradient-card rounded-lg">
                  <div className="font-semibold">Mode</div>
                  <div className="text-sm text-muted-foreground capitalize">{classData.mode}</div>
                </div>
                <div className="text-center p-3 bg-gradient-card rounded-lg">
                  <div className="font-semibold">Subject</div>
                  <div className="text-sm text-muted-foreground">{classData.subject}</div>
                </div>
                <div className="text-center p-3 bg-gradient-card rounded-lg">
                  <div className="font-semibold">Class</div>
                  <div className="text-sm text-muted-foreground">{classData.className}</div>
                </div>
                <div className="text-center p-3 bg-gradient-card rounded-lg">
                  <div className="font-semibold">Location</div>
                  <div className="text-sm text-muted-foreground">
                    {classData.mode === "offline" ? classData.roomNumber : "Online"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gradient-success rounded-lg text-white">
                  <span>Face Detection System</span>
                  <Badge className="bg-white/20 text-white">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-success rounded-lg text-white">
                  <span>Attendance Tracking</span>
                  <Badge className="bg-white/20 text-white">Running</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-primary rounded-lg text-white">
                  <span>{classData.mode === "offline" ? "CCTV Integration" : "Meeting Integration"}</span>
                  <Badge className="bg-white/20 text-white">Connected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Student List View - shows students for selected subject
  if (currentView === "student-list") {
    const subjectData = mockClassData[selectedSubject as keyof typeof mockClassData];
    
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentView("main")}>
              ← Back to Dashboard
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                {selectedSubject} - {subjectData.className}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {subjectData.students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-gradient-card hover:shadow-card transition-all duration-200 cursor-pointer"
                    onClick={() => handleStudentClick(student)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.rollNumber}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">{student.attendance}%</div>
                        <Progress value={student.attendance} className="w-20" />
                        {student.attendance < 75 && (
                          <Badge variant="destructive" className="mt-1">Low Attendance</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Student Detail View - shows individual student analytics and attendance override
  if (currentView === "student-detail" && selectedStudent) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentView("student-list")}>
              ← Back to Student List
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                {selectedStudent.name} - Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{selectedStudent.attendance}%</div>
                    <div className="text-sm text-muted-foreground">Overall Attendance</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">
                      {selectedStudent.dailyAttendance.filter((d: any) => d.status === "present").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Classes Attended</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{selectedStudent.rollNumber}</div>
                    <div className="text-sm text-muted-foreground">Roll Number</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Daily Attendance Record</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedStudent.dailyAttendance.map((record: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gradient-card"
                  >
                    <div className="font-medium">{record.date}</div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={record.status === "present" ? "default" : "destructive"}
                        className="capitalize"
                      >
                        {record.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant={record.status === "present" ? "default" : "outline"}
                          onClick={() => overrideStudentAttendance(record.date, "present")}
                          className="px-2 py-1 text-xs"
                        >
                          Present
                        </Button>
                        <Button
                          size="sm"
                          variant={record.status === "absent" ? "destructive" : "outline"}
                          onClick={() => overrideStudentAttendance(record.date, "absent")}
                          className="px-2 py-1 text-xs"
                        >
                          Absent
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentView === "analytics") {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setCurrentView("main")}>
              ← Back
            </Button>
            <Button variant="outline" onClick={() => navigate("/")}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Student Analytics - All Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {Object.entries(mockClassData).map(([subject, data]) => (
                  <Card key={subject} className="bg-gradient-card">
                    <CardHeader>
                      <CardTitle className="text-lg">{subject} - {data.className}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        {data.students.map((student) => (
                          <div
                            key={student.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:shadow-sm transition-all cursor-pointer"
                            onClick={() => {
                              setSelectedSubject(subject);
                              handleStudentClick(student);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{student.name}</div>
                                <div className="text-sm text-muted-foreground">{student.rollNumber}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="font-semibold">{student.attendance}%</div>
                                <Progress value={student.attendance} className="w-16" />
                              </div>
                              {student.attendance < 75 && (
                                <Badge variant="destructive">Alert</Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {mockTeacherData.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-card hover:shadow-primary transition-all duration-300 cursor-pointer" onClick={() => setCurrentView("class-setup")}>
            <CardContent className="p-6 text-center">
              <Play className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Start New Class</h3>
              <p className="text-muted-foreground">Begin a new class session with attendance tracking</p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-primary transition-all duration-300 cursor-pointer" onClick={() => setCurrentView("analytics")}>
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
              <p className="text-muted-foreground">Check student attendance and manage records</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Your Subjects</CardTitle>
            <p className="text-sm text-muted-foreground">Click on a subject to manage student attendance</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockTeacherData.subjects.map((subject, index) => {
                const subjectData = mockClassData[subject as keyof typeof mockClassData];
                const totalStudents = subjectData.students.length;
                const lowAttendanceCount = subjectData.students.filter(s => s.attendance < 75).length;
                
                return (
                  <Card 
                    key={index} 
                    className="bg-gradient-card hover:shadow-card transition-all duration-300 cursor-pointer"
                    onClick={() => handleSubjectClick(subject)}
                  >
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="font-semibold text-primary">{subject}</div>
                        <div className="text-sm text-muted-foreground">{subjectData.className}</div>
                        <div className="flex justify-between text-xs">
                          <span>{totalStudents} Students</span>
                          {lowAttendanceCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {lowAttendanceCount} Low Attendance
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;