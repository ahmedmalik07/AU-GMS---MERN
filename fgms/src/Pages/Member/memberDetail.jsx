import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../../Components/Modal/modal';
import { MemberContext } from '../../contexts/MemberContext';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const plans = [
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
  { label: 'Yearly', value: 'Yearly' },
];

const MemberDetail = () => {
  const { id } = useParams();
  const { members, updateMember } = useContext(MemberContext);
  const navigate = useNavigate();
  const member = members.find((m) => m._id === id);
  const [showRenew, setShowRenew] = useState(false);
  const [plan, setPlan] = useState(member?.membership || '');
  const [expiry, setExpiry] = useState(member?.expiry || '');

  if (!member)
    return (
      <div className='flex flex-col items-center justify-center h-full p-10'>
        <div className='text-2xl text-gray-500 mb-4'>Member not found</div>
        <button
          onClick={() => navigate(-1)}
          className='px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2'
        >
          <ArrowBackIosIcon fontSize='small' />
          Back
        </button>
      </div>
    );

  const handleRenew = async (e) => {
    e.preventDefault();
    try {
      await updateMember(member._id, { membership: plan, expiry });
      setShowRenew(false);
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Failed to update member: ' + error.message);
    }
  };

  return (
    <div className='max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-8 relative'>
      <button
        onClick={() => navigate(-1)}
        className='absolute left-4 top-4 text-indigo-600 hover:underline flex items-center gap-2'
      >
        <ArrowBackIosIcon fontSize='small' />
        Back
      </button>
      <div className='flex flex-col md:flex-row items-center gap-8'>
        <img
          src={
            member.picture ||
            'https://static.vecteezy.com/system/resources/thumbnails/042/350/567/small_2x/ai-generated-3d-rendering-of-a-cartoon-of-gym-boy-with-dumbbells-on-transparent-background-ai-generated-png.png'
          }
          alt='Profile'
          className='w-32 h-32 rounded-full border-4 border-indigo-200 object-cover shadow'
        />
        <div className='flex-1'>
          <h2 className='text-3xl font-bold text-indigo-700 mb-2'>
            {member.name}
          </h2>
          <div className='mb-2 text-gray-600'>
            Phone: <span className='font-mono'>{member.number}</span>
          </div>
          <div className='mb-2 text-gray-600'>
            Membership:{' '}
            <span className='font-semibold text-indigo-500'>
              {member.membership || 'N/A'}
            </span>
          </div>
          <div className='mb-2 text-gray-600'>
            Expiry:{' '}
            <span className='font-semibold text-indigo-500'>
              {member.expiry || 'N/A'}
            </span>
          </div>
          <div className='mb-2 text-gray-600'>
            Status:{' '}
            <span
              className={`px-2 py-1 rounded text-xs ${
                member.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : member.status === 'inactive'
                  ? 'bg-gray-200 text-gray-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {member.status}
            </span>
          </div>
          <button
            onClick={() => setShowRenew(true)}
            className='mt-4 px-5 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition'
          >
            Renew Membership
          </button>
        </div>
      </div>
      {showRenew && (
        <Modal
          header='Renew Membership'
          handleClose={() => setShowRenew(false)}
          content={() => (
            <form onSubmit={handleRenew} className='flex flex-col gap-4'>
              <label className='font-semibold text-gray-700'>Select Plan</label>
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className='border p-2 rounded'
              >
                <option value=''>Select Membership</option>
                {plans.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <label className='font-semibold text-gray-700'>Expiry Date</label>
              <input
                type='date'
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className='border p-2 rounded'
                required
              />
              <button
                type='submit'
                className='bg-green-600 text-white p-2 rounded'
              >
                Save
              </button>
            </form>
          )}
        />
      )}
    </div>
  );
};

export default MemberDetail;
