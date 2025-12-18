import React from "react";

export default function GlobalEdit({ selectedChart, setSelectedChart, setShowEditPanelPopup, setShowNewDashboardPopup }) {
  return (
    <div className="p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">
        Edit Panel
      </h2>
      <div className="flex-1 overflow-y-auto">
        {/* Example editable fields */}
        <label className="block mb-2 text-lg  font-medium">
          Title
        </label>
        <input
          type="text"
          value={selectedChart?.title}
          onChange={(e) => setSelectedChart({ ...selectedChart, title: e.target.value })}
          className="w-full border rounded p-2 mb-4"
        />
        <label className="block mb-2 text-lg font-medium">
          Modify Prompt
        </label>
        <textarea
          rows={8}
          className="w-full border rounded p-2 mb-4  outline-0 resize-none no-scrollbar" >
        </textarea>
        <div className="flex items-center gap-3 mt-2 text-sm text-blue-600">
          <button className="hover:underline">Upload</button>
          <button className="hover:underline">Reference</button>
        </div>
      </div>
      <div className="mt-2 flex justify-end gap-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Generate
        </button>
        <button
          className="px-4 py-2 bg-gray-300 rounded"
          onClick={() => { setShowEditPanelPopup(false); setShowNewDashboardPopup(true); setSelectedChart(null) }}
        >
          Cancel
        </button>
      </div>
    </div>

    // <div className="w-[20%] border border-black bg-white rounded-2xl shadow-lg p-4">
    //   {/* Title */}
    //   <div className="flex justify-between items-center mb-4">
    //     <h2 className="text-lg font-semibold">Global Edit</h2>
    //     <button className="text-gray-400 hover:text-gray-600">✕</button>
    //   </div>

    //   {/* Prompt Box */}
    //   <textarea
    //     placeholder="Enter your prompt to edit"
    //     className="w-full h-32 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
    //     minLength={5}
    //   />

    //   {/* Upload / Reference */}
    //   <div className="flex justify-between mt-2 text-sm text-blue-600">
    //     <button className="hover:underline">Upload</button>
    //     <button className="hover:underline">Reference</button>
    //   </div>

    //   {/* Generate Button */}
    //   <button className="w-full mt-4 py-2 rounded-lg bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold">
    //     Generate
    //   </button>
    // </div>
  );
}
