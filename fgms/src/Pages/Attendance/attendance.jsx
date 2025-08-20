import React, { useState, useContext, useMemo } from 'react';
import { Checkbox } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { format, differenceInDays } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { MemberContext } from '../../contexts/MemberContext';

const Attendance = () => {
  const { members, markAttendance, loading, error } = useContext(MemberContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState(() =>
    format(new Date(), 'yyyy-MM-dd')
  );
  const [attendanceState, setAttendanceState] = useState({});

  // Filter members by search
  const filteredMembers = useMemo(
    () =>
      members.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.number.includes(search)
      ),
    [members, search]
  );

  // Mark attendance for a member
  const handleMark = async (memberId, present) => {
    if (!present) return; // Only allow marking present for now

    try {
      await markAttendance(memberId);
      // Update local state to show immediate feedback
      setAttendanceState((prev) => ({
        ...prev,
        [memberId]: true,
      }));
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance: ' + error.message);
    }
  };

  // Check if member was present today based on their attendance array
  const wasPresentToday = (member) => {
    if (!member.attendance || !Array.isArray(member.attendance)) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return member.attendance.some((att) => {
      const attDate = new Date(att.date);
      attDate.setHours(0, 0, 0, 0);
      return attDate.getTime() === today.getTime();
    });
  };

  // Get last present date for a member
  const getLastPresentDate = (member) => {
    if (!member.attendance || !Array.isArray(member.attendance)) return null;

    const sortedAttendance = member.attendance
      .map((att) => new Date(att.date))
      .sort((a, b) => b - a);

    return sortedAttendance.length > 0
      ? format(sortedAttendance[0], 'yyyy-MM-dd')
      : null;
  };

  return (
    <div className='w-full min-h-screen p-6 bg-slate-50'>
      <div className='flex items-center gap-3 mb-6'>
        <SearchIcon className='text-indigo-600' />
        <input
          className='border p-2 rounded w-80'
          placeholder='Search by name or number'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className='ml-auto flex items-center gap-2'>
          <span className='text-lg font-semibold text-indigo-700'>
            Attendance for
          </span>
          <input
            type='date'
            className='border p-2 rounded'
            value={selectedDate}
            max={format(new Date(), 'yyyy-MM-dd')}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ minWidth: 140 }}
          />
        </div>
      </div>
      <div className='bg-white rounded-lg shadow p-4'>
        <table className='w-full text-left'>
          <thead>
            <tr className='border-b'>
              <th className='py-2'>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Mark Present</th>
              <th>Last Present</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((m, idx) => {
              const isPresentToday =
                wasPresentToday(m) || attendanceState[m._id];
              const lastPresent = getLastPresentDate(m);

              return (
                <tr key={m._id} className='border-b hover:bg-slate-100 group'>
                  <td className='py-2'>{idx + 1}</td>
                  <td
                    className='flex items-center gap-2 cursor-pointer group-hover:underline'
                    onClick={() => navigate(`/member/${m._id}`)}
                  >
                    <PersonIcon className='text-indigo-500' />
                    {m.name}
                  </td>
                  <td>{m.number}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        m.membershipStatus === 'active'
                          ? 'bg-green-100 text-green-700'
                          : m.membershipStatus === 'expired'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {m.membershipStatus || 'active'}
                    </span>
                  </td>
                  <td>
                    <Checkbox
                      checked={isPresentToday}
                      icon={<CancelIcon className='text-gray-400' />}
                      checkedIcon={
                        <CheckCircleIcon className='text-green-600' />
                      }
                      onChange={(e) => handleMark(m._id, e.target.checked)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isPresentToday} // Disable if already marked present
                    />
                  </td>
                  <td>
                    {lastPresent ? (
                      lastPresent
                    ) : (
                      <span className='text-gray-400'>Never</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {loading && <div className='text-center py-4'>Loading...</div>}
        {error && (
          <div className='text-center py-4 text-red-500'>Error: {error}</div>
        )}
        {filteredMembers.length === 0 && !loading && (
          <div className='text-center text-gray-500 py-10'>
            No members found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
