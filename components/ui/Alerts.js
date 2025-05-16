import { useEffect } from "react";

export default function Alert({ type = "success", message, onClose, onConfirm, isConfirm = false }) {
  useEffect(() => {
    if (!isConfirm) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [onClose, isConfirm]);

  const bgColor = {
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
    confirm: "bg-blue-100 border-blue-500 text-blue-700",
  }[type] || "bg-gray-100 border-gray-400 text-gray-800";

  return (
    <div className={`fixed top-6 right-10 z-50 border-l-4 p-4 rounded shadow-md max-w-sm w-full ${bgColor}`}>
      <div className="flex flex-col space-y-4">
        <span className="text-base font-medium">{message}</span>

        {isConfirm ? (
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
            >
              Yes
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="text-xl font-bold hover:text-black"
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
