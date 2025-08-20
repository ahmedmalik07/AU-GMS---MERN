import React, { useState } from 'react';

const defaultPlans = [
  { label: '1 Month Plan', value: '1', price: '' },
  { label: '2 Month Plan', value: '2', price: '' },
  { label: '3 Month Plan', value: '3', price: '' },
  { label: '4 Month Plan', value: '4', price: '' },
  { label: '6 Month Plan', value: '6', price: '' },
  { label: '8 Month Plan', value: '8', price: '' },
  { label: '10 Month Plan', value: '10', price: '' },
  { label: '12 Month Plan', value: '12', price: '' },
];

const MembershipManager = ({ onClose }) => {
  const [plans, setPlans] = useState(defaultPlans);
  const [newPlanMonths, setNewPlanMonths] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('');
  const [planError, setPlanError] = useState('');

  const handleAddPlan = e => {
    e.preventDefault();
    if (!newPlanMonths || !newPlanPrice) {
      setPlanError('Enter months and price.');
      return;
    }
    if (plans.some(p => p.value === newPlanMonths)) {
      setPlanError('Plan for this month already exists.');
      return;
    }
    setPlans([
      ...plans,
      { label: `${newPlanMonths} Month Plan`, value: newPlanMonths, price: newPlanPrice },
    ]);
    setPlanError('');
    setNewPlanMonths('');
    setNewPlanPrice('');
  };

  const handleDeletePlan = value => {
    setPlans(plans.filter(p => p.value !== value));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl font-bold text-slate-800 mb-2 text-center">Manage Membership Packages</div>
      <div className="border-t pt-4 mt-2">
        <div className="text-lg font-semibold text-indigo-700 mb-2 text-center">Add New Monthly Package</div>
        <form className="flex gap-2 mb-2" onSubmit={handleAddPlan}>
          <input
            type="number"
            min={1}
            placeholder="Months"
            className="border p-2 rounded w-1/2 focus:outline-indigo-500"
            value={newPlanMonths}
            onChange={e => setNewPlanMonths(e.target.value)}
          />
          <input
            type="number"
            min={0}
            placeholder="Price"
            className="border p-2 rounded w-1/2 focus:outline-indigo-500"
            value={newPlanPrice}
            onChange={e => setNewPlanPrice(e.target.value)}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </form>
        {planError && <div className="text-red-500 text-center">{planError}</div>}
      </div>
      <div className="mt-4">
        <div className="text-md font-semibold mb-2 text-center">Available Packages</div>
        <ul className="divide-y">
          {plans.map((plan, i) => (
            <li key={plan.value} className="flex justify-between items-center py-2">
              <span>
                <span className="font-medium">{plan.label}</span>
                {plan.price && (
                  <span className="ml-2 text-gray-600">Rs {plan.price}</span>
                )}
              </span>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition text-xs"
                onClick={() => handleDeletePlan(plan.value)}
                type="button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 transition mt-2"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  );
};

export default MembershipManager;
