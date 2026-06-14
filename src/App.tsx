import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Register } from './pages/Register';
import { AttendanceCapture } from './pages/AttendanceCapture';
import { Toaster } from 'sonner';
import { Camera, LayoutDashboard, UserPlus } from 'lucide-react';

const NavLink = ({ to, children, icon: Icon }: any) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${isActive
          ? 'bg-blue-600 text-white shadow-md'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
        }`}
    >
      <Icon className="w-5 h-5" />
      {children}
    </Link>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-200">
        <Toaster position="top-right" richColors />

        {/* Modern Navigation Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <ScanFaceIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                SmartPresence
              </span>
            </div>

            <nav className="flex items-center gap-2">
              <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
              <NavLink to="/capture" icon={Camera}>Capture</NavLink>
              <NavLink to="/register" icon={UserPlus}>Register</NavLink>
            </nav>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="animate-in fade-in duration-500">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/capture" element={<AttendanceCapture />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// Inline icon for logo since lucide doesn't export strict ScanFace natively sometimes, but it does.
// Just aliasing it here to be safe and visually distinct.
import { ScanFace as ScanFaceIcon } from 'lucide-react';

export default App;
