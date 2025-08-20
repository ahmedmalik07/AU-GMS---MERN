import React from 'react'
import CircleIcon from '@mui/icons-material/Circle';

const MemberCard = ({ member }) => {
  // Calculate membership status
  const getMembershipStatus = () => {
    const now = new Date();
    const expiryDate = new Date(member.expiry);
    
    if (!member.isActive) return 'Inactive';
    if (now > expiryDate) return 'Expired';
    return 'Active';
  };

  // Format expiry date
  const formatExpiryDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg p-1 shadow flex flex-col items-center transition-all duration-300 hover:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:text-white hover:cursor-pointer hover:scale-105 h-full">
      <div className="w-28 h-28 flex justify-center relative items-center border-2 p-1 mx-auto rounded-full">
        <img className="w-full h-full rounded-full object-cover" src={member.picture || "https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg?semt=ais_items_boosted&w=740"} alt="member" />
      </div>
      <div className="mx-auto mt-5 text-center text-xl font-semibold font-mono">{member.name}</div>
      <div className="mx-auto text-center text-xl font-mono">{member.number}</div>
      <div className="mx-auto text-center text-xl font-mono">Next Bill Date: {formatExpiryDate(member.expiry)}</div>
      <div className="mx-auto text-center text-md font-mono text-gray-500">Status: {getMembershipStatus()}</div>
    </div>
  )
}

export default MemberCard