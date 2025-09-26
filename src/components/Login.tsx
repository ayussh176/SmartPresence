import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [userType, setUserType] = useState<"student" | "teacher" | null>(null);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock login data
  const mockCredentials = {
    student: { username: "student", password: "student123" },
    teacher: { username: "teacher", password: "teacher123" }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock login validation
    const mockData = mockCredentials[userType as keyof typeof mockCredentials];
    
    if (credentials.username === mockData.username && credentials.password === mockData.password) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${credentials.username}!`,
      });
      
      if (userType === "student") {
        navigate("/student-dashboard");
      } else {
        navigate("/teacher-dashboard");
      }
    } else {
      toast({
        title: "Login Failed", 
        description: "Invalid credentials. Check the mock login data below.",
        variant: "destructive",
      });
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-primary">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Attendance Management
            </CardTitle>
            <p className="text-muted-foreground mt-2">Choose your role to continue</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full h-16 bg-gradient-card hover:shadow-card transition-all duration-300"
              onClick={() => setUserType("student")}
            >
              <GraduationCap className="mr-3 h-6 w-6 text-primary" />
              <div className="text-left">
                <div className="font-semibold">Student Login</div>
                <div className="text-sm text-muted-foreground">View your attendance</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full h-16 bg-gradient-card hover:shadow-card transition-all duration-300"
              onClick={() => setUserType("teacher")}
            >
              <Users className="mr-3 h-6 w-6 text-primary" />
              <div className="text-left">
                <div className="font-semibold">Teacher Login</div>
                <div className="text-sm text-muted-foreground">Manage classes</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-primary">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            {userType === "student" ? (
              <GraduationCap className="h-6 w-6 text-primary" />
            ) : (
              <Users className="h-6 w-6 text-primary" />
            )}
            {userType === "student" ? "Student" : "Teacher"} Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mock Login Credentials */}
          <div className="p-3 bg-muted rounded-lg text-sm">
            <div className="font-semibold mb-2 text-primary">Mock Login Credentials:</div>
            <div className="space-y-1 text-muted-foreground">
              <div><strong>Username:</strong> {userType}</div>
              <div><strong>Password:</strong> {userType}123</div>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUserType(null)}
                className="w-1/3"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-primary hover:shadow-primary">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;