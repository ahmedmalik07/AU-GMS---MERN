import React, { useEffect, useState } from 'react'
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { NavLink, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const Sidebar = ({ onLogout }) => {
  const [greeting, setGreeting] = useState('');
  const [open, setOpen] = useState(false);
  const [adminName, setAdminName] = useState(() => sessionStorage.getItem('adminName') || 'Admin');
  const [profilePic, setProfilePic] = useState(() => {
    return sessionStorage.getItem('sidebarProfilePic') ||
      'https://wpassets.graana.com/blog/wp-content/uploads/2023/05/Air-Univ.jpg';
  });
  const location = useLocation();

  useEffect(() => {
    setOpen(false); // Close sidebar on route change
  }, [location.pathname]);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning 🌞");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon 🌅");
    } else {
      setGreeting("Good Evening 🌙");
    }
  }, []);

  useEffect(() => {
    // Listen for changes to profile pic and name in sessionStorage (custom event only)
    const handler = () => {
      const pic = sessionStorage.getItem('sidebarProfilePic') || 'https://wpassets.graana.com/blog/wp-content/uploads/2023/05/Air-Univ.jpg';
      setProfilePic(pic);
      setAdminName(sessionStorage.getItem('adminName') || 'Admin');
    };
    window.addEventListener('profilePicChanged', handler);
    return () => {
      window.removeEventListener('profilePicChanged', handler);
    };
  }, []);

  // Remove any global event listeners that may have been left over from previous code
  useEffect(() => {
    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, []);

  const baseBtn =
    'flex gap-8 font-semibold text-xl bg-slate-800 p-3 rounded-xl cursor-pointer transition-all duration-200 shadow-sm mb-4';
  const hoverBtn =
    'hover:bg-gradient-to-r hover:from-green-400 hover:via-blue-500 hover:to-purple-700 hover:text-green-300';
  const activeBtn =
    'bg-gradient-to-r from-green-400 via-blue-500 to-purple-700 text-green-300';

  return (
    <>
      {/* Mobile topbar */}
      <div className="md:hidden flex items-center justify-between bg-black p-4 border-b-2 border-gray-800">
        <div className="text-xl font-bold text-white">Air University Gym</div>
        <button onClick={() => setOpen(o => !o)}>
          <MenuIcon className="text-white" fontSize="large" />
        </button>
      </div>
      {/* Sidebar for desktop, drawer for mobile */}
      <div className={`fixed md:static z-40 top-0 left-0 h-full md:h-auto w-64 md:w-1/4 bg-black border-r-2 border-gray-800 text-white p-6 flex flex-col shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} style={{minHeight: '100vh'}}>
        <div className="text-center text-3xl text-white font-extralight mb-6 tracking-wide select-none hidden md:block">
          Air University Gym
        </div>
        <div className="hidden md:flex gap-5 my-5 items-center text-white">
          <img
            src={profilePic}
            alt="Gym Picture"
            className="w-[80px] h-[80px] rounded-3xl border-2 border-indigo-500 shadow-lg"
          />
          <div>
            <div className='text-2xl font-bold'>{adminName || 'Admin'}</div>
            <div className='font-semibold mt-1 text-indigo-300'>{greeting}</div>
          </div>
        </div>
        <div className='mt-10 py-10 px-2 border-t-2 border-gray-700 flex flex-col'>
          <NavLink to="/dashboard" className={({isActive}) => `${baseBtn} ${hoverBtn} ${isActive ? activeBtn : ''}`}> <HomeWorkIcon /> <div>Dashboard</div> </NavLink>
          <NavLink to="/member" className={({isActive}) => `${baseBtn} ${hoverBtn} ${isActive ? activeBtn : ''}`}> <SupervisedUserCircleIcon /> <div>Members</div> </NavLink>
          <NavLink to="/attendance" className={({isActive}) => `${baseBtn} ${hoverBtn} ${isActive ? activeBtn : ''}`}> <CheckCircleIcon /> <div>Attendance</div> </NavLink>
          <NavLink to="/reports" className={({isActive}) => `${baseBtn} ${hoverBtn} ${isActive ? activeBtn : ''}`}> <DescriptionIcon /> <div>Reports</div> </NavLink>
          <div className={`${baseBtn} ${hoverBtn} mt-8`} onClick={onLogout}> <LogoutIcon /> <div>Logout</div> </div>
        </div>
      </div>
      {/* Overlay for mobile drawer */}
      {open && <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden" onClick={() => setOpen(false)}></div>}
    </>
  );
}

export default Sidebar;