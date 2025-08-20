import React, { useEffect, useState, useContext } from 'react';
import MemberCard from '../MemberCard/memberCard';
import { useParams, useNavigate } from 'react-router-dom';
import { MemberContext } from '../../contexts/MemberContext';

const filterMembers = (members, type) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  switch (type) {
    case 'monthly-joined':
      return members.filter((m) => new Date(m.joined) >= startOfMonth);
    case 'expiring-3':
      return members.filter((m) => {
        const exp = new Date(m.expiry);
        return (
          exp > now && exp <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
        );
      });
    case 'expiring-4-7':
      return members.filter((m) => {
        const exp = new Date(m.expiry);
        return (
          exp > new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) &&
          exp <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        );
      });
    case 'expired':
      return members.filter((m) => new Date(m.expiry) < now);
    case 'inactive':
      return members.filter((m) => m.status === 'inactive');
    default:
      return members;
  }
};

const StatsList = () => {
  const { type } = useParams();
  const { members, markAttendance } = useContext(MemberContext);
  const navigate = useNavigate();

  const filtered = filterMembers(members, type);
  const titles = {
    'monthly-joined': 'Monthly Joined Members',
    'expiring-3': 'Expiring within 3 Days',
    'expiring-4-7': 'Expiring within 4-7 Days',
    expired: 'Expired Members',
    inactive: 'Inactive Members',
  };

  const handleMarkAttendance = async (memberId) => {
    try {
      await markAttendance(memberId);
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance: ' + error.message);
    }
  };
  return (
    <div className='p-8 w-full'>
      <h2 className='text-2xl font-bold mb-4'>{titles[type] || 'Members'}</h2>
      <div className='grid gap-5 grid-cols-3 min-w-0'>
        {filtered.length === 0 && (
          <div className='col-span-3 text-center text-gray-500'>
            No members found.
          </div>
        )}
        {filtered.map((m) => (
          <div
            key={m._id}
            className='relative'
            onClick={() => navigate(`/member/${m._id}`)}
            style={{ cursor: 'pointer' }}
          >
            <MemberCard member={m} />
            <button
              className='absolute top-2 right-2 bg-green-500 hover:bg-green-700 text-white rounded-full p-1'
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAttendance(m._id);
              }}
              title='Mark Attendance'
            >
              Mark Attendance
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsList;
