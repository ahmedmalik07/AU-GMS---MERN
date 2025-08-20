import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
  Outlet,
} from 'react-router-dom';
import Home from './Pages/Home/home';
import Dashboard from './Pages/Dashboard/dashboard';
import Sidebar from './Components/Sidebar/sidebar';
import Member from './Pages/Member/member';
import Reports from './Pages/Reports/reports';
import StatsList from './Pages/Member/statsList';
import Attendance from './Pages/Attendance/attendance';
import MemberDetail from './Pages/Member/memberDetail';
import { useState, useEffect } from 'react';
import { MemberProvider } from './contexts/MemberContext';

function AuthLayout({ onLogout }) {
  const location = useLocation();
  // Only show Sidebar if not on login page
  const showSidebar = location.pathname !== '/';

  console.log(
    'AuthLayout - location.pathname:',
    location.pathname,
    'showSidebar:',
    showSidebar
  );

  return (
    <div className='flex min-h-screen'>
      {showSidebar && <Sidebar onLogout={onLogout} />}
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isLogedIn = sessionStorage.getItem('isLogin');
      const token = sessionStorage.getItem('token');

      console.log(
        'Auth check - isLogedIn:',
        isLogedIn,
        'token:',
        !!token,
        'pathname:',
        location.pathname
      );

      const authenticated = isLogedIn === 'true' && !!token;
      setIsLogin(authenticated);

      // Only redirect if we're not on the login page and not authenticated
      if (!authenticated && location.pathname !== '/') {
        console.log('Redirecting to login - not authenticated');
        navigate('/', { replace: true });
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [location.pathname, navigate]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='text-xl'>Loading...</div>
      </div>
    );
  }

  // Centralized logout handler
  const handleLogout = () => {
    console.log('Logging out user');
    sessionStorage.removeItem('isLogin');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('adminName');
    sessionStorage.removeItem('sidebarProfilePic');
    setIsLogin(false);
    navigate('/');
  };

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route element={<AuthLayout onLogout={handleLogout} />}>
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/member' element={<Member />} />
        <Route path='/member/:id' element={<MemberDetail />} />
        <Route path='/reports' element={<Reports />} />
        <Route path='/stats/:type' element={<StatsList />} />
        <Route path='/attendance' element={<Attendance />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <MemberProvider>
      <Router>
        <AppContent />
      </Router>
    </MemberProvider>
  );
}

export default App;

// In each page (Dashboard, Member, Reports, StatsList, Attendance), replace props with:
// const { members, setMembers } = useOutletContext();
