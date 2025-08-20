import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimerIcon from '@mui/icons-material/Timer';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Modal from '../../Components/Modal/modal';
import MembershipManager from '../../Components/Addmembership/MembershipManager';
import { MemberContext } from '../../contexts/MemberContext';
import LinearProgress from '@mui/material/LinearProgress';
import { differenceInDays } from 'date-fns';

const Dashboard = () => {
  const { members, attendance, addMember, loading, error } =
    useContext(MemberContext);
  const navigate = useNavigate();
  const [accordianDashboard, setAccordianDashboard] = useState(false);
  const [showMembership, setShowMembership] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const ref = useRef();

  // Debug logging
  console.log('Dashboard component rendered');
  console.log('Dashboard component - members:', members);
  console.log('Dashboard component - members length:', members?.length);
  console.log('Dashboard component - attendance:', attendance);
  console.log('Dashboard component - loading:', loading);
  console.log('Dashboard component - error:', error);

  // Check if we're authenticated
  useEffect(() => {
    const isLogedIn = sessionStorage.getItem('isLogin');
    const token = sessionStorage.getItem('token');
    console.log(
      'Dashboard auth check - isLogedIn:',
      isLogedIn,
      'token:',
      !!token
    );

    if (isLogedIn !== 'true' || !token) {
      console.log('Dashboard: Not authenticated, redirecting to login');
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        accordianDashboard &&
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setAccordianDashboard(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [accordianDashboard]);

  // Calculate stats
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Ensure members is always an array
  const membersList = Array.isArray(members) ? members : [];
  console.log(
    'Dashboard - membersList:',
    membersList,
    'length:',
    membersList.length
  );

  // Monthly joined: unique by name+number, joined this month
  const monthlyJoinedSet = new Set();
  const monthlyJoined = membersList.filter((m) => {
    if (!m.joined) return false;
    const joinedDate = new Date(m.joined);
    const uniqueKey = m.name + m.number;
    if (joinedDate >= startOfMonth && !monthlyJoinedSet.has(uniqueKey)) {
      monthlyJoinedSet.add(uniqueKey);
      return true;
    }
    return false;
  }).length;

  // Helper: get last present date for a member
  function getLastPresentDate(memberId) {
    const presentDates = Object.entries(attendance)
      .filter(([date, att]) => att[memberId])
      .map(([date]) => date)
      .sort();
    return presentDates.length > 0
      ? presentDates[presentDates.length - 1]
      : null;
  }

  // Inactive: not present in last 10 days
  const inactive = membersList.filter((m) => {
    const lastPresent = getLastPresentDate(m._id);
    if (!lastPresent) return false;
    return differenceInDays(new Date(), new Date(lastPresent)) >= 10;
  }).length;

  // Expired: expiry < today
  const expired = membersList.filter((m) => {
    const exp = new Date(m.expiry);
    return exp < now;
  }).length;

  // Expiring in 3 days: expiry in next 3 days (not expired)
  const expiring3 = membersList.filter((m) => {
    const exp = new Date(m.expiry);
    return (
      exp >= now && exp <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    );
  }).length;

  // Expiring in 4-7 days: expiry in 4-7 days from now (not expired)
  const expiring47 = membersList.filter((m) => {
    const exp = new Date(m.expiry);
    return (
      exp > new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) &&
      exp <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    );
  }).length;

  // Add member handler with proper API call
  const handleAddMember = async (member) => {
    try {
      await addMember(member);
      setShowAddMember(false);
    } catch (error) {
      console.error('Error adding member:', error);
      alert('Failed to add member: ' + error.message);
    }
  };

  // AddMemberForm component for image upload
  const AddMemberForm = ({ onAdd }) => {
    const [form, setForm] = useState({
      name: '',
      number: '',
      expiry: '',
      membership: '',
      picture: '',
    });
    const [preview, setPreview] = useState(
      'https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg?semt=ais_items_boosted&w=740'
    );
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const handleChange = async (e) => {
      const { name, value, files } = e.target;
      if (name === 'picture' && files && files[0]) {
        const file = files[0];
        setUploading(true);
        setUploadProgress(0);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'gym-management');
        try {
          const res = await axios.post(
            'https://api.cloudinary.com/v1_1/dzhnpfaiv/image/upload',
            formData,
            {
              onUploadProgress: (progressEvent) => {
                const percent = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setUploadProgress(percent);
              },
            }
          );
          setForm((f) => ({ ...f, picture: res.data.secure_url }));
          setPreview(res.data.secure_url);
        } catch (err) {
          alert('Image upload failed!');
        }
        setUploading(false);
      } else {
        setForm((f) => ({ ...f, [name]: value }));
      }
    };
    return (
      <form
        className='flex flex-col gap-3 p-3'
        onSubmit={(e) => {
          e.preventDefault();
          onAdd(form);
        }}
      >
        <input
          name='name'
          placeholder='Full Name'
          className='border p-2 rounded'
          required
          value={form.name}
          onChange={handleChange}
        />
        <input
          name='number'
          placeholder='Phone Number'
          className='border p-2 rounded'
          required
          value={form.number}
          onChange={handleChange}
        />
        <select
          name='membership'
          className='border p-2 rounded'
          required
          value={form.membership}
          onChange={handleChange}
        >
          <option value=''>Select Membership</option>
          <option value='Monthly'>Monthly</option>
          <option value='Quarterly'>Quarterly</option>
          <option value='Yearly'>Yearly</option>
        </select>
        <input
          name='expiry'
          type='date'
          className='border p-2 rounded'
          required
          value={form.expiry}
          onChange={handleChange}
        />
        <input
          name='picture'
          type='file'
          accept='image/*'
          className='border p-2 rounded'
          onChange={handleChange}
        />
        {uploading && (
          <LinearProgress
            variant='determinate'
            value={uploadProgress}
            className='mt-2'
          />
        )}
        <img
          src={form.picture || preview}
          alt='Preview'
          className='w-20 h-20 rounded-full mx-auto'
        />
        <button type='submit' className='bg-green-600 text-white p-2 rounded'>
          Add Member
        </button>
      </form>
    );
  };

  return (
    <div className='w-full min-h-screen text-black p-5 relative'>
      {/* Show loading state */}
      {loading && (
        <div className='flex justify-center items-center h-64'>
          <div className='text-xl'>Loading dashboard...</div>
          <LinearProgress className='mt-4' />
        </div>
      )}

      {/* Show error state */}
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          Error loading data: {error}
        </div>
      )}

      {/* Main dashboard content */}
      <div className='w-full bg-slate-900 text-white rounded-lg flex p-3 justify-between items-center'>
        <MenuIcon
          sx={{ fontSize: '30px' }}
          className='cursor-pointer'
          onClick={() => {
            setAccordianDashboard((prev) => !prev);
          }}
        />
        <img
          className='w-8 h-8 rounded-3xl border-2'
          src={
            sessionStorage.getItem('sidebarProfilePic') ||
            'https://wpassets.graana.com/blog/wp-content/uploads/2023/05/Air-Univ.jpg'
          }
          alt={sessionStorage.getItem('adminName') || 'Admin'}
          title={sessionStorage.getItem('adminName') || 'Admin'}
        />
      </div>
      {accordianDashboard && (
        <div
          ref={ref}
          className='absolute p-3 bg-slate-900 text-white rounded-xl text-lg font-extralight'
        >
          <div>Welcome to our Gym Management System</div>
          <p>Feel free to ask to contact</p>
        </div>
      )}
      <div className='flex justify-between mt-5'>
        <button
          className='flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition'
          onClick={() => setShowMembership(true)}
        >
          Membership <AddIcon />
        </button>
        <button
          className='flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition'
          onClick={() => setShowAddMember(true)}
        >
          Add Member <AddIcon />
        </button>
      </div>
      {/* Membership Modal */}
      {showMembership && (
        <Modal
          header='Membership'
          handleClose={() => setShowMembership(false)}
          content={() => (
            <MembershipManager onClose={() => setShowMembership(false)} />
          )}
        />
      )}
      {/* Add Member Modal */}
      {showAddMember && (
        <Modal
          header='Add Member'
          handleClose={() => setShowAddMember(false)}
          content={() => <AddMemberForm onAdd={handleAddMember} />}
        />
      )}
      <div className='mt-5 pt-3 bg-slate-100 bg-opacity-50 grid gap-5 grid-cols-3 w-full pb-5 overflow-x-auto h-[80%]'>
        {/* Card blocks with stats */}
        <div
          className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'
          onClick={() => navigate('/member')}
        >
          <div className='h-3 rounded-t-lg bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500'></div>
          <div className='py-7 px-5 flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
            <AccountCircleIcon
              sx={{ fontSize: '70px' }}
              className='text-indigo-500 mb-3'
            />
            <p className='text-xl my-3 font-semibold font-mono'>
              Joined Members
            </p>
            <div className='text-3xl font-bold'>{membersList.length}</div>
          </div>
        </div>
        <div
          className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'
          onClick={() => navigate('/stats/monthly-joined')}
        >
          <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'></div>
          <div className='py-7 px-5 flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
            <TrendingUpIcon
              sx={{ fontSize: '70px' }}
              className='text-green-500 mb-3'
            />
            <p className='text-xl my-3 font-semibold font-mono'>
              Monthly Joined
            </p>
            <div className='text-3xl font-bold'>{monthlyJoined}</div>
          </div>
        </div>
        <div
          className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'
          onClick={() => navigate('/stats/expiring-3')}
        >
          <div className='h-3 rounded-t-lg bg-gradient-to-r from-yellow-500 via-purple-500 to-red-500'></div>
          <div className='py-7 px-5 flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
            <TimerIcon
              sx={{ fontSize: '70px' }}
              className='text-blue-400 mb-3'
            />
            <p className='text-xl my-3 font-semibold font-mono'>
              Expiring within 3 days
            </p>
            <div className='text-3xl font-bold'>{expiring3}</div>
          </div>
        </div>
        <div
          className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'
          onClick={() => navigate('/stats/expiring-4-7')}
        >
          <div className='h-3 rounded-t-lg bg-gradient-to-r from-yellow-500 via-blue-500 to-pink-500'></div>
          <div className='py-7 px-5 flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
            <TimerIcon
              sx={{ fontSize: '70px' }}
              className='text-yellow-300 mb-3'
            />
            <p className='text-xl my-3 font-semibold font-mono'>
              Expiring within 4-7 days
            </p>
            <div className='text-3xl font-bold'>{expiring47}</div>
          </div>
        </div>
        <div
          className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'
          onClick={() => navigate('/stats/expired')}
        >
          <div className='h-3 rounded-t-lg bg-gradient-to-r from-indigo-500 via-purple-800 to-pink-700'></div>
          <div className='py-7 px-5 flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
            <TimerOffIcon
              sx={{ fontSize: '70px' }}
              className='text-red-500 mb-3'
            />
            <p className='text-xl my-3 font-semibold font-mono'>Expired</p>
            <div className='text-3xl font-bold'>{expired}</div>
          </div>
        </div>
        <div
          className='w-full h-fit border-2 bg-white rounded-lg cursor-pointer'
          onClick={() => navigate('/stats/inactive')}
        >
          <div className='h-3 rounded-t-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'></div>
          <div className='py-7 px-5 flex-col justify-center items-center w-full text-center rounded-b-lg hover:bg-slate-900 hover:text-white'>
            <TimerOffIcon
              sx={{ fontSize: '70px' }}
              className='text-gray-500 mb-3'
            />
            <p className='text-xl my-3 font-semibold font-mono'>
              Inactive Members
            </p>
            <div className='text-3xl font-bold'>{inactive}</div>
          </div>
        </div>
      </div>
      {/* Responsive footer */}
      <footer className='w-full flex justify-center items-center py-2 mt-8 bg-transparent'>
        <span className='text-xs text-black-400 text-center'>
          Ahmed Malik — For technical issues, contact: +92 319 3608483
        </span>
      </footer>
    </div>
  );
};

export default Dashboard;
