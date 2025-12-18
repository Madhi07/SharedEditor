import { HexColorPicker } from "react-colorful";
import { useState } from "react";

export default function ColorPicker() {
     const [color, setColor] = useState("#ff0000"); // valid color for picker
  const [hexInput, setHexInput] = useState("#ff0000"); // allows incomplete input

  const isValidHex = (hex) =>
    /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(hex);

  const handleHexChange = (value) => {
    setHexInput(value);

    if (isValidHex(value)) {
      setColor(value);
    }
  };

  return (
    <div className="p-3 border-slate-300 border rounded-lg ">
      <div className="w-full  flex flex-col gap-3">
        <div className="flex justify-center py-2">
        {/* COLOR PICKER */}
        <HexColorPicker color={color} onChange={(newColor) => {
          setColor(newColor);
          setHexInput(newColor);
        }} />

        </div>
        <div className="mt-4 flex gap-2  ">
        {/* HEX INPUT */}
        <input
          className="border border-gray-300 p-2  w-full rounded"
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          placeholder="#rrggbb"
        />

        </div>

         {/* Action Buttons */}
      <div className=" flex gap-2">
        <button
          type="button"
        //   onClick={handleCancel}
          className="w-1/2 border border-gray-300 p-2 rounded-lg text-sm hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          type="button"
        //   onClick={handleConfirm}
        //   disabled={!isValidHex(hexInput)}
          className={`w-1/2 p-2 rounded-lg text-sm text-white transition
            bg-indigo-600 hover:bg-indigo-700`}
        >
          Confirm
        </button>
      </div>

      </div>
    </div>
  );
}