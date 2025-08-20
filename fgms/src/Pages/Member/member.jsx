import React, { useState, useEffect, useContext } from 'react'
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MemberCard from '../MemberCard/memberCard';
import Modal from '../../Components/Modal/modal';
import MembershipManager from '../../Components/Addmembership/MembershipManager';
import DeleteIcon from '@mui/icons-material/Delete';
import { MemberContext } from '../../contexts/MemberContext';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';

const Member = () => {
  const { members, addMember, updateMember, deleteMember } = useContext(MemberContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showMembership, setShowMembership] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [deletedMembers, setDeletedMembers] = useState([]);
  const [search, setSearch] = useState('');
  const membersPerPage = 9;

  // Debug logging
  console.log('Member component - members:', members);
  console.log('Member component - members length:', members?.length);

  // Pagination logic
  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.number.includes(search));
  const totalPages = Math.ceil(filteredMembers.length / membersPerPage);
  const paginatedMembers = filteredMembers.slice((currentPage-1)*membersPerPage, currentPage*membersPerPage);

  useEffect(() => { setCurrentPage(1); }, [search, members.length]);

  const handleMembership = () => setShowMembership(prev => !prev);
  const handleSearch = (e) => setSearch(e.target.value);
  const handlePageChange = (dir) => {
    setCurrentPage(p => Math.max(1, Math.min(totalPages, p + dir)));
  };
  const handleRemoveMember = async (id) => {
    await deleteMember(id);
    // Optionally update deletedMembers UI
    // setDeletedMembers(d => [...d, id]);
  };
  const handleAddMember = async (member) => {
    const today = new Date().toISOString().slice(0, 10);
    await addMember({ ...member, joined: today });
    setShowAddMember(false);
    setCurrentPage(1);
  };
  const handleEditMember = async (id, updated) => {
    await updateMember(id, updated);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="text-black p-5">
        <div className="border-2 bg-slate-900 flex justify-between items-center w-full text-white rounded-lg p-3">
          <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition" onClick={()=>setShowMembership(true)}>
            Membership <AddIcon />
          </button>
          <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:scale-105 transition" onClick={()=>setShowAddMember(true)}>
            Add Member <AddIcon />
          </button>
          <img className='w-8 h-8 rounded-3xl border-2 ml-4' src={sessionStorage.getItem('sidebarProfilePic') || 'https://wpassets.graana.com/blog/wp-content/uploads/2023/05/Air-Univ.jpg'} alt={sessionStorage.getItem('adminName') || 'Admin'} title={sessionStorage.getItem('adminName') || 'Admin'} />
        </div>
        <div className="mt-4">
          <Link to="/dashboard" className="flex items-center text-indigo-600 hover:underline">
            <ArrowBackIosIcon fontSize="small" />
            Back to Dashboard
          </Link>
        </div>
        <div className="mt-5 w-full flex gap-2">
          <input
            type="text"
            placeholder="Search Member by name or number"
            className="border-2 w-3/4 p-2 rounded-lg"
            value={search}
            onChange={handleSearch}
          />
          <div className="bg-slate-900 p-3 border-2 text-white rounded-lg cursor-pointer hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-black">
            <PersonSearchIcon />
          </div>
        </div>
        <div className='mt-5 text-xl flex justify-between  text-slate-900 '>
          <div>Total Members</div>
          <div className="flex gap-5 items-center">
            <div>{(currentPage-1)*membersPerPage+1}-{Math.min(currentPage*membersPerPage, filteredMembers.length)} of {filteredMembers.length} Members</div>
            <div className={'w-8 h-8 cursor-pointer border-2 flex items-center justify-center hover:text-white hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'} onClick={()=>handlePageChange(-1)}> <ArrowLeftIcon /> </div>
            <div className={'w-8 h-8 cursor-pointer border-2 flex items-center justify-center hover:text-white hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'} onClick={()=>handlePageChange(1)}> <ArrowRightIcon /></div>
          </div>
        </div>
      </div>
      <div className='bg-slate-100 p-5 rounded-lg w-full' style={{height: "350px", overflowY: "auto"}}>
        <div className="grid gap-5 grid-cols-3 min-w-0">
          {paginatedMembers.map(m => (
            <div key={m._id} className="relative" onClick={() => navigate(`/member/${m._id}`)} style={{cursor: 'pointer'}}>
              <MemberCard member={m} />
              <button className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 text-white rounded-full p-1" onClick={e => {e.stopPropagation(); handleRemoveMember(m._id);}} title="Remove Member"><DeleteIcon /></button>
            </div>
          ))}
          {paginatedMembers.length === 0 && <div className="col-span-3 text-center text-gray-500">No members found.</div>}
        </div>
      </div>
      {/* Membership Modal */}
      {showMembership && (
        <Modal
          header="Membership"
          handleClose={()=>setShowMembership(false)}
          content={() => <MembershipManager onClose={()=>setShowMembership(false)} />}
        />
      )}
      {/* Add Member Modal */}
      {showAddMember && (
        <Modal
          header="Add Member"
          handleClose={()=>setShowAddMember(false)}
          content={() => (
            <AddMemberForm onAdd={handleAddMember} />
          )}
        />
      )}
      {/* Deleted/Expired Members Section */}
      {deletedMembers.length > 0 && (
        <div className="bg-red-100 p-4 m-4 rounded-lg">
          <h3 className="text-red-700 font-bold mb-2">Deleted/Expired Members</h3>
          <div className="grid gap-3 grid-cols-3">
            {deletedMembers.map(m => (
              <div key={m.id} className="p-2 bg-white rounded shadow">
                <div className="font-semibold">{m.name}</div>
                <div className="text-xs text-gray-500">{m.number}</div>
                <div className="text-xs text-gray-400">Expired: {m.expiry}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// AddMemberForm component for image upload
const AddMemberForm = ({ onAdd }) => {
  const [form, setForm] = useState({ name: '', number: '', expiry: '', membership: '', picture: '' });
  const [preview, setPreview] = useState('https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg?semt=ais_items_boosted&w=740');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = async e => {
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
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            },
          }
        );
        setForm(f => ({ ...f, picture: res.data.secure_url }));
        setPreview(res.data.secure_url);
      } catch (err) {
        setError('Image upload failed! Please try again.');
        console.error('Image upload error:', err);
      }
      setUploading(false);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      console.log('Attempting form submission...');
      // Validate form data
      if (!form.name || !form.number || !form.membership || !form.expiry) {
        console.log('Validation Error: Missing required fields');
        throw new Error('Please fill in all required fields');
      }

      // Validate phone number format
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(form.number)) {
        console.log('Validation Error: Invalid phone number format');
        throw new Error('Please enter a valid 10-digit phone number');
      }

      // Validate expiry date
      const expiryDate = new Date(form.expiry);
      const today = new Date();
      // Set today to the start of the day for accurate comparison
      today.setHours(0, 0, 0, 0);
      // Set expiryDate to the start of its day for accurate comparison
      expiryDate.setHours(0, 0, 0, 0);

      if (expiryDate < today) {
        console.log('Validation Error: Expiry date in the past');
        throw new Error('Expiry date cannot be in the past');
      }

      console.log('Client-side validation passed. Calling onAdd...');
      await onAdd(form);
      console.log('onAdd completed.');
      setForm({ name: '', number: '', expiry: '', membership: '', picture: '' });
      setPreview('https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg?semt=ais_items_boosted&w=740');
    } catch (err) {
      setError(err.message || 'Failed to add member. Please try again.');
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-3 p-3" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <input 
        name="name" 
        placeholder="Full Name" 
        className="border p-2 rounded" 
        required 
        value={form.name} 
        onChange={handleChange}
        disabled={loading}
      />
      <input 
        name="number" 
        placeholder="Phone Number (10 digits)" 
        className="border p-2 rounded" 
        required 
        value={form.number} 
        onChange={handleChange}
        disabled={loading}
      />
      <select 
        name="membership" 
        className="border p-2 rounded" 
        required 
        value={form.membership} 
        onChange={handleChange}
        disabled={loading}
      >
        <option value="">Select Membership</option>
        <option value="Monthly">Monthly</option>
        <option value="Quarterly">Quarterly</option>
        <option value="Yearly">Yearly</option>
      </select>
      <input 
        name="expiry" 
        type="date" 
        className="border p-2 rounded" 
        required 
        value={form.expiry} 
        onChange={handleChange}
        disabled={loading}
      />
      <input 
        name="picture" 
        type="file" 
        accept="image/*" 
        className="border p-2 rounded" 
        onChange={handleChange}
        disabled={loading}
      />
      {uploading && <LinearProgress variant="determinate" value={uploadProgress} className="mt-2" />}
      <img src={form.picture || preview} alt="Preview" className="w-20 h-20 rounded-full mx-auto" />
      <button 
        type="submit" 
        className={`bg-green-600 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
        disabled={loading}
      >
        {loading ? 'Adding Member...' : 'Add Member'}
      </button>
    </form>
  );
};

export default Member;