import React, { useState, useEffect } from "react";

const HelpModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={onClose}>
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl" onClick={(e) => e.stopPropagation()} >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recommended Strength</h2>
            
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border border-gray-300 px-4 py-2 text-left">Group</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Force kg</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Recommended Strength (N)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">Babies</td>
                        <td className="border border-gray-300 px-4 py-2">3 - 5 kg</td>
                        <td className="border border-gray-300 px-4 py-2">30 - 50 N</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">Kids</td>
                        <td className="border border-gray-300 px-4 py-2">10 - 20 kg</td>
                        <td className="border border-gray-300 px-4 py-2">100 - 200 N</td>
                    </tr>
                    <tr>
                        <td className="border border-gray-300 px-4 py-2 font-semibold">Adults</td>
                        <td className="border border-gray-300 px-4 py-2">40 - 60 kg</td>
                        <td className="border border-gray-300 px-4 py-2">400 - 600 N</td>
                    </tr>
                </tbody>
            </table>

            <div className="text-right mt-4">
            <button 
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                onClick={onClose}
            >
                Close
            </button>
            </div>
        </div>
    </div>
  );
};

const App = () => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="p-6">
        <button  className="text-blue-600 text-sm hover:underline" onClick={() => setModalOpen(true)} >
            Help?
        </button>
        <HelpModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default App;
