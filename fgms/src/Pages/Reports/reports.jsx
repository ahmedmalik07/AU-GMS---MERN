import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import MemberCard from '../MemberCard/memberCard';
import { MemberContext } from '../../contexts/MemberContext';

const Reports = () => {
  const { members } = useContext(MemberContext);
  const [filteredMembers, setFilteredMembers] = useState(members);
  const navigate = useNavigate();

  const generatePDF = () => {
    if (!members || members.length === 0) {
      alert('No members to export.');
      return;
    }
    const doc = new jsPDF();
    doc.text('Gym Members Report', 14, 16);
    autoTable(doc, {
      head: [['ID', 'Name', 'Number', 'Status', 'Joined', 'Expiry']],
      body: members.map(m => [m.id, m.name, m.number, m.status, m.joined, m.expiry]),
      startY: 22,
    });
    doc.save('gym_members_report.pdf');
  };

  return (
    <div className="p-8 w-full">
      <h2 className="text-2xl font-bold mb-4">Reports</h2>
      <div className="mb-6">
        <button onClick={generatePDF} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-800">Download Members Report (PDF)</button>
      </div>
      <div className="bg-white rounded shadow p-4">
        <h3 className="font-semibold mb-2">Members Overview</h3>
        <div className="grid gap-5 grid-cols-3 min-w-0">
          {filteredMembers.length === 0 && <div className="col-span-3 text-center text-gray-500">No members found.</div>}
          {filteredMembers.map(m => (
            <div key={m.id} className="relative" onClick={() => navigate(`/member/${m.id}`)} style={{cursor: 'pointer'}}>
              <MemberCard member={m} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
