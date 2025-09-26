import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, BarChart3, Calendar, GraduationCap, LogOut, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const mockStudentData = {
  name: "John Doe",
  rollNumber: "CS2021001",
  overallAttendance: 72,
  subjects: [
    { 
      name: "Data Structures", 
      attendance: 85, 
      totalClasses: 40, 
      attendedClasses: 34,
      dailyAttendance: [
        { date: "2024-01-15", status: "Present" },
        { date: "2024-01-16", status: "Present" },
        { date: "2024-01-17", status: "Absent" },
        { date: "2024-01-18", status: "Present" },
        { date: "2024-01-19", status: "Present" },
      ]
    },
    { 
      name: "Database Management", 
      attendance: 78, 
      totalClasses: 36, 
      attendedClasses: 28,
      dailyAttendance: [
        { date: "2024-01-15", status: "Present" },
        { date: "2024-01-16", status: "Absent" },
        { date: "2024-01-17", status: "Present" },
        { date: "2024-01-18", status: "Absent" },
        { date: "2024-01-19", status: "Present" },
      ]
    },
    { 
      name: "Operating Systems", 
      attendance: 65, 
      totalClasses: 38, 
      attendedClasses: 25,
      dailyAttendance: [
        { date: "2024-01-15", status: "Absent" },
        { date: "2024-01-16", status: "Present" },
        { date: "2024-01-17", status: "Absent" },
        { date: "2024-01-18", status: "Present" },
        { date: "2024-01-19", status: "Absent" },
      ]
    },
    { 
      name: "Computer Networks", 
      attendance: 68, 
      totalClasses: 35, 
      attendedClasses: 24,
      dailyAttendance: [
        { date: "2024-01-15", status: "Present" },
        { date: "2024-01-16", status: "Absent" },
        { date: "2024-01-17", status: "Present" },
        { date: "2024-01-18", status: "Absent" },
        { date: "2024-01-19", status: "Present" },
      ]
    }
  ]
};

const StudentDashboard = () => {
  const [selectedSubject, setSelectedSubject] = useState<typeof mockStudentData.subjects[0] | null>(null);
  const navigate = useNavigate();

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return "text-accent";
    if (percentage >= 65) return "text-warning";
    return "text-destructive";
  };

  const getAttendanceBadge = (percentage: number) => {
    if (percentage >= 75) return "bg-gradient-success text-white";
    if (percentage >= 65) return "bg-gradient-warning text-white";
    return "bg-destructive text-destructive-foreground";
  };

  const lowAttendanceSubjects = mockStudentData.subjects.filter(subject => subject.attendance < 75);

  if (selectedSubject) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => setSelectedSubject(null)}
              className="mb-4"
            >
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
                <BarChart3 className="h-5 w-5 text-primary" />
                {selectedSubject.name} - Detailed View
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{selectedSubject.attendance}%</div>
                    <div className="text-sm text-muted-foreground">Overall Attendance</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-accent">{selectedSubject.attendedClasses}</div>
                    <div className="text-sm text-muted-foreground">Classes Attended</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-card">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-muted-foreground">{selectedSubject.totalClasses}</div>
                    <div className="text-sm text-muted-foreground">Total Classes</div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Recent Attendance
                </h3>
                <div className="grid gap-2">
                  {selectedSubject.dailyAttendance.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-gradient-card">
                      <span className="font-medium">{new Date(day.date).toLocaleDateString()}</span>
                      <Badge className={day.status === "Present" ? "bg-gradient-success text-white" : "bg-destructive text-destructive-foreground"}>
                        {day.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Student Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {mockStudentData.name}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Alert for low attendance */}
        {lowAttendanceSubjects.length > 0 && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-semibold">Attendance Alert!</span>
              </div>
              <p className="text-sm mt-2">
                Your attendance is below 75% in {lowAttendanceSubjects.length} subject(s): {" "}
                {lowAttendanceSubjects.map(s => s.name).join(", ")}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6 text-center">
              <div className={`text-3xl font-bold ${getAttendanceColor(mockStudentData.overallAttendance)}`}>
                {mockStudentData.overallAttendance}%
              </div>
              <div className="text-sm text-muted-foreground mt-1">Overall Attendance</div>
              <Progress value={mockStudentData.overallAttendance} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary">{mockStudentData.subjects.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Subjects</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent">
                {mockStudentData.subjects.filter(s => s.attendance >= 75).length}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Above 75%</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-destructive">{lowAttendanceSubjects.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Below 75%</div>
            </CardContent>
          </Card>
        </div>

        {/* Subject-wise Attendance */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Subject-wise Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {mockStudentData.subjects.map((subject, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg bg-gradient-card hover:shadow-card transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedSubject(subject)}
                >
                  <div className="flex-1">
                    <div className="font-semibold">{subject.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {subject.attendedClasses}/{subject.totalClasses} classes attended
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={subject.attendance} className="w-24" />
                    <Badge className={getAttendanceBadge(subject.attendance)}>
                      {subject.attendance}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;