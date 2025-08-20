import React, { useState } from 'react';
import logger from '../../assets/logger.jpg';
import loginlogo from '../../assets/loginlogo.png';
import Modal from '../../Components/Modal/modal';
import Forgot from '../../Components/forgotPassword/forgot.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = 'http://localhost:4000/api';
import LinearProgress from '@mui/material/LinearProgress';

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [forgotPassword, setForgotPassword] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    gender: 'Male',
    name: '',
    email: '',
    password: '',
    picture: '',
  });
  const [registerPreview, setRegisterPreview] = useState(
    'https://static.vecteezy.com/system/resources/thumbnails/042/350/567/small_2x/ai-generated-3d-rendering-of-a-cartoon-of-gym-boy-with-dumbbells-on-transparent-background-ai-generated-png.png'
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  const navigate = useNavigate();

  // Basic login logic: sets sessionStorage and redirects
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert('Both fields are required.');
      return;
    }

    try {
      console.log('Attempting login with:', { email: username });

      // Use /api/auth/login and send { email, password }
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: username,
        password,
      });

      console.log('Login response:', res.data);

      if (res.data.token) {
        // Clear any existing session data first
        sessionStorage.clear();

        // Set new session data
        sessionStorage.setItem('isLogin', 'true');
        sessionStorage.setItem('token', res.data.token);
        sessionStorage.setItem('adminName', res.data.user?.name || username);
        sessionStorage.setItem(
          'sidebarProfilePic',
          'https://wpassets.graana.com/blog/wp-content/uploads/2023/05/Air-Univ.jpg'
        );

        console.log('Session storage set, navigating to dashboard');
        console.log(
          'Session check - isLogin:',
          sessionStorage.getItem('isLogin')
        );
        console.log(
          'Session check - token:',
          !!sessionStorage.getItem('token')
        );

        // Force a page reload to ensure state is properly updated
        window.location.href = '/dashboard';
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.msg || err.message || 'Login failed';
      alert(errorMsg);
    }
  };

  const handleScrollToRegister = () => {
    document
      .getElementById('register-section')
      ?.scrollIntoView({ behavior: 'smooth' });
  };
  const handleClose = () => {
    setForgotPassword((prev) => !prev);
  };

  const handleRegisterChange = async (e) => {
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
        setRegisterForm((f) => ({ ...f, picture: res.data.secure_url }));
        setRegisterPreview(res.data.secure_url);
      } catch (err) {
        alert('Image upload failed!');
      }
      setUploading(false);
    } else {
      setRegisterForm((f) => ({ ...f, [name]: value }));
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    try {
      // Use /api/auth/register and send { name, email, password, role }
      await axios.post(`${API_URL}/auth/register`, {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        role: 'admin',
      });
      setRegisterSuccess('Registration successful! Logging you in...');
      // Auto-login after registration
      const res = await axios.post(`${API_URL}/auth/login`, {
        email: registerForm.email,
        password: registerForm.password,
      });
      sessionStorage.setItem('isLogin', 'true');
      sessionStorage.setItem('token', res.data.token || '');
      sessionStorage.setItem('adminName', registerForm.name);
      sessionStorage.setItem(
        'sidebarProfilePic',
        registerForm.picture ||
          'https://wpassets.graana.com/blog/wp-content/uploads/2023/05/Air-Univ.jpg'
      );
      window.dispatchEvent(new Event('profilePicChanged'));
      navigate('/dashboard');
    } catch (err) {
      setRegisterError(
        err.response?.data?.msg || 'Registration failed. Please try again.'
      );
    }
  };
  return (
    <>
      <nav className='sticky top-0 z-30 bg-gradient-to-r from-indigo-800 to-purple-950 text-white py-0 px-1 md:px-1 flex items-center shadow-md font'>
        <img
          src={loginlogo}
          alt='Navbar Logo'
          className='w-10 h-10 mr-3 transform transition-transform duration-500 hover:scale-110 hover:rotate-5'
        />
        <span className='text-lg font-semibold'>
          Air University Central Gym
        </span>
      </nav>

      <div className='container mx-auto max-w-6xl flex flex-col md:flex-row justify-center items-center gap-4 min-h-[calc(100vh-56px)] bg-slate-100 px-2 md:px-4'>
        <div className='flex-1 max-w-xl mb-6 md:mb-0'>
          <img
            src={logger}
            alt='Gym Side'
            className='w-full rounded-2xl shadow-xl'
          />
        </div>

        <div className='flex-1 max-w-xl bg-white p-6 rounded-2xl shadow-xl text-center'>
          <div className='flex flex-col items-center mb-6'>
            <img
              src={loginlogo}
              alt='Login Logo'
              className='w-32 md:w-36 mb-2 transform transition-transform duration-500 hover:scale-110 hover:rotate-5'
            />
            <h2 className='text-indigo-600 text-xl md:text-2xl font-semibold'>
              Air University Central Gym
            </h2>
          </div>

          <form onSubmit={handleLogin}>
            <div className='relative mb-6'>
              <input
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className='w-full p-3 border border-gray-200 rounded-lg bg-gray-50'
                id='username'
              />
              <label
                htmlFor='username'
                className={`absolute left-3 transition-all duration-300 text-gray-500 ${
                  username
                    ? '-top-2 text-xs bg-white px-1 text-indigo-500'
                    : 'top-1/2 -translate-y-1/2 text-sm'
                }`}
              >
                Admin ID
              </label>
            </div>

            <div className='relative mb-6'>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full p-3 border border-gray-200 rounded-lg bg-gray-50'
                id='password'
              />
              <label
                htmlFor='password'
                className={`absolute left-3 transition-all duration-300 text-gray-500 ${
                  password
                    ? '-top-2 text-xs bg-white px-1 text-indigo-500'
                    : 'top-1/2 -translate-y-1/2 text-sm'
                }`}
              >
                Password
              </label>
            </div>

            <button
              type='submit'
              className='w-full p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300'
            >
              Login
            </button>
          </form>

          <p
            onClick={handleClose}
            className='mt-3 text-red-600 hover:underline cursor-pointer text-sm'
          >
            Forgot Password?
          </p>
          <p
            onClick={handleScrollToRegister}
            className='mt-2 text-indigo-600 hover:underline cursor-pointer text-sm'
          >
            New admin? Register here
          </p>
          <input type='checkbox' id='toggle-register' className=' ' />
          <label
            htmlFor='toggle-register'
            className='fixed bottom-4 right-4 bg-indigo-600 text-black p-3 rounded-full shadow-lg cursor-pointer hover:bg-indigo-700 transition-colors'
          >
            Remeber Me
          </label>
        </div>
      </div>

      <div
        id='register-section'
        className='bg-gradient-to-br from-gray-100 to-slate-200 flex justify-center items-center py-12 px-2 md:px-4'
      >
        <div className='bg-white p-6 rounded-2xl shadow-xl max-w-md w-full'>
          <h2 className='text-indigo-600 text-2xl font-semibold mb-6 text-center'>
            Admin Registration
          </h2>
          {registerError && (
            <div className='text-red-600 text-sm mb-2'>{registerError}</div>
          )}
          {registerSuccess && (
            <div className='text-green-600 text-sm mb-2'>{registerSuccess}</div>
          )}
          <form onSubmit={handleRegister}>
            <div className='relative mb-6'>
              <select
                name='gender'
                value={registerForm.gender}
                onChange={handleRegisterChange}
                className='w-full p-3 border border-gray-200 rounded-lg bg-gray-50'
              >
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
              </select>
              <label className='absolute -top-2 left-3 text-xs bg-white px-1 text-indigo-500'>
                Gender
              </label>
            </div>
            <div className='relative mb-6'>
              <input
                type='text'
                id='full-name'
                name='name'
                className='w-full p-3 border border-gray-200 rounded-lg bg-gray-50'
                required
                value={registerForm.name}
                onChange={handleRegisterChange}
              />
              <label
                htmlFor='full-name'
                className={`absolute left-3 transition-all duration-300 text-gray-500 ${
                  registerForm.name
                    ? '-top-2 text-xs bg-white px-1 text-indigo-500'
                    : 'top-1/2 -translate-y-1/2 text-sm'
                }`}
              >
                Full Name
              </label>
            </div>
            <div className='relative mb-6'>
              <input
                type='email'
                id='email'
                name='email'
                className='w-full p-3 border border-gray-200 rounded-lg bg-gray-50'
                required
                value={registerForm.email}
                onChange={handleRegisterChange}
              />
              <label
                htmlFor='email'
                className={`absolute left-3 transition-all duration-300 text-gray-500 ${
                  registerForm.email
                    ? '-top-2 text-xs bg-white px-1 text-indigo-500'
                    : 'top-1/2 -translate-y-1/2 text-sm'
                }`}
              >
                Email
              </label>
            </div>
            <div className='relative mb-6'>
              <input
                type='password'
                id='create-password'
                name='password'
                className='w-full p-3 border border-gray-200 rounded-lg bg-gray-50'
                required
                value={registerForm.password}
                onChange={handleRegisterChange}
              />
              <label
                htmlFor='create-password'
                className={`absolute left-3 transition-all duration-300 text-gray-500 ${
                  registerForm.password
                    ? '-top-2 text-xs bg-white px-1 text-indigo-500'
                    : 'top-1/2 -translate-y-1/2 text-sm'
                }`}
              >
                Create Password
              </label>
            </div>
            <div className='relative mb-6'>
              <input
                type='file'
                id='profile-pic'
                name='picture'
                className='w-full p-2 border border-gray-200 rounded-lg bg-gray-50'
                accept='image/*'
                onChange={handleRegisterChange}
              />
              <label
                htmlFor='profile-pic'
                className='absolute -top-2 left-3 text-xs bg-white px-1 text-indigo-500'
              >
                Profile Picture
              </label>
              {uploading && (
                <LinearProgress
                  variant='determinate'
                  value={uploadProgress}
                  className='mt-2'
                />
              )}
            </div>
            <img
              src={registerForm.picture || registerPreview}
              alt='Profile Preview'
              className='w-24 h-24 mx-auto mb-4 rounded-full border-2 border-gray-200 object-cover'
            />
            <button
              type='submit'
              className='w-full p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 mt-2'
            >
              Register
            </button>
          </form>
        </div>
      </div>

      {forgotPassword && (
        <Modal
          header='Forgot Password'
          onClose={handleClose}
          handleClose={handleClose}
          content={() => <Forgot onClose={handleClose} />}
        />
      )}
    </>
  );
};

export default Home;
