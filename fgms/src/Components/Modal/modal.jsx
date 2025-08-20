import React from 'react'
import ClearIcon from '@mui/icons-material/Clear';

const Modal = ({ header, handleClose, content }) => {
  React.useEffect(() => {
    // Prevent background scroll and cleanup on unmount
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-xl bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="text-2xl font-semibold">{header}</div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
            <ClearIcon sx={{ fontSize: "28px" }} />
          </button>
        </div>
        <div className="p-8">
          {typeof content === "function" ? content() : content}
        </div>
      </div>
    </div>
  );
};

export default Modal;