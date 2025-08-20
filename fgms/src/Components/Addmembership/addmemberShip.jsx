import React, { useState } from 'react';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';

const defaultPlans = [
  { label: '1 Month Plan', value: '1' },
  { label: '2 Month Plan', value: '2' },
  { label: '3 Month Plan', value: '3' },
  { label: '4 Month Plan', value: '4' },
  { label: '6 Month Plan', value: '6' },
  { label: '8 Month Plan', value: '8' },
  { label: '10 Month Plan', value: '10' },
  { label: '12 Month Plan', value: '12' },
];

const AddmemberShip = ({ onAdd, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    startDate: '',
    endDate: '',
    plan: '',
    price: '',
    picture: '',
  });
  const [preview, setPreview] = useState('https://img.freepik.com/free-vector/hand-drawn-nft-style-ape-illustration_23-2149622021.jpg?semt=ais_items_boosted&w=740');
  const [plans, setPlans] = useState(defaultPlans);
  const [newPlanMonths, setNewPlanMonths] = useState('');
  const [newPlanPrice, setNewPlanPrice] = useState('');
  const [error, setError] = useState('');
  const [planError, setPlanError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
        alert('Image upload failed!');
      }
      setUploading(false);
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setError('');
  };

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

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.startDate || !form.endDate || !form.plan || !form.price) {
      setError('Please fill all fields.');
      return;
    }
    if (onAdd) onAdd(form);
    if (onClose) onClose();
  };

  // When plan changes, set price if available
  React.useEffect(() => {
    const selected = plans.find(p => p.value === form.plan);
    if (selected && selected.price) {
      setForm(f => ({ ...f, price: selected.price }));
    }
  }, [form.plan, plans]);

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="text-2xl font-bold text-slate-800 mb-2 text-center">Add New Member</div>
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        className="border p-2 rounded focus:outline-indigo-500"
        value={form.name}
        onChange={handleChange}
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        className="border p-2 rounded focus:outline-indigo-500"
        value={form.phone}
        onChange={handleChange}
      />
      <div className="flex gap-2">
        <input
          type="date"
          name="startDate"
          placeholder="Start Date"
          className="border p-2 rounded w-1/2 focus:outline-indigo-500"
          value={form.startDate}
          onChange={handleChange}
        />
        <input
          type="date"
          name="endDate"
          placeholder="End Date"
          className="border p-2 rounded w-1/2 focus:outline-indigo-500"
          value={form.endDate}
          onChange={handleChange}
        />
      </div>
      <select
        name="plan"
        className="border p-2 rounded focus:outline-indigo-500"
        value={form.plan}
        onChange={handleChange}
        required
      >
        <option value="">Select Plan</option>
        {plans.map((p, i) => (
          <option key={i} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
      <input
        type="number"
        name="price"
        placeholder="Price"
        className="border p-2 rounded focus:outline-indigo-500"
        value={form.price}
        onChange={handleChange}
        min={0}
        required
      />
      {error && <div className="text-red-500 text-center">{error}</div>}

      <div className="border-t pt-4 mt-2">
        <div className="text-lg font-semibold text-indigo-700 mb-2 text-center">Add New Monthly Package</div>
        <div className="flex gap-2 mb-2">
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
            type="button"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            onClick={handleAddPlan}
          >
            Add
          </button>
        </div>
        {planError && <div className="text-red-500 text-center">{planError}</div>}
      </div>

      <input
        type="file"
        name="picture"
        accept="image/*"
        className="border p-2 rounded focus:outline-indigo-500"
        onChange={handleChange}
      />
      {uploading && <LinearProgress variant="determinate" value={uploadProgress} className="mt-2" />}
      <img src={form.picture || preview} alt="Preview" className="w-20 h-20 rounded-full mx-auto" />

      <div className="flex gap-2 mt-2 justify-center">
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Add Member
        </button>
        <button
          type="button"
          className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400 transition"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddmemberShip;