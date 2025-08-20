import React, { useState } from 'react';

const Forgot = ({ onClose }) => {
  const [step, setStep] = useState(1); // 1: email, 2: otp/password
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Simulate sending OTP
  const handleSendOtp = e => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email.');
      return;
    }
    setOtpSent(true);
    setOtp('123456'); // In real app, generate/send OTP via API
    setStep(2);
    setError('');
  };

  // Simulate verifying OTP and setting new password
  const handleResetPassword = e => {
    e.preventDefault();
    if (!enteredOtp || !newPassword || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }
    if (enteredOtp !== otp) {
      setError('Invalid OTP.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setSuccess(true);
    setError('');
  };

  return (
    <form
      className="flex flex-col gap-5 bg-white rounded-lg p-6 shadow-lg min-w-[320px] max-w-xs mx-auto"
      onSubmit={step === 1 ? handleSendOtp : handleResetPassword}
    >
      <div className="text-2xl font-bold text-indigo-700 mb-2 text-center">Forgot Password</div>

      {success ? (
        <div className="text-green-600 text-center font-semibold">
          Password reset successfully!
        </div>
      ) : (
        <>
          {step === 1 && (
            <>
              <label className="text-sm text-slate-700 font-medium mb-1 text-left" htmlFor="email">
                Enter your email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="your@email.com"
                className="border p-2 rounded focus:outline-indigo-500"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition mt-2"
              >
                Send OTP
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-700 font-medium" htmlFor="otp">
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  placeholder="Enter OTP"
                  className="border p-2 rounded w-28 focus:outline-indigo-500"
                  value={enteredOtp}
                  onChange={e => setEnteredOtp(e.target.value)}
                  required
                />
              </div>
              <label className="text-sm text-slate-700 font-medium mt-2" htmlFor="new-password">
                New Password
              </label>
              <input
                type="password"
                name="new-password"
                id="new-password"
                placeholder="New Password"
                className="border p-2 rounded focus:outline-indigo-500"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
              <label className="text-sm text-slate-700 font-medium mt-2" htmlFor="confirm-password">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm-password"
                id="confirm-password"
                placeholder="Confirm New Password"
                className="border p-2 rounded focus:outline-indigo-500"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition mt-2"
              >
                Confirm New Password
              </button>
            </>
          )}
          {error && <div className="text-red-500 text-center">{error}</div>}
        </>
      )}

      <button
        type="button"
        className="bg-gray-200 text-gray-700 px-6 py-2 rounded hover:bg-gray-300 transition mt-2"
        onClick={onClose}
      >
        Close
      </button>
    </form>
  );
};

export default Forgot;