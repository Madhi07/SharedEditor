import { useRef, useState, useEffect } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

export default function DashboardSwitcher({ sessionData, chatId,  }) {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const WorkspaceSwitchPopupRef = useRef(null);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        WorkspaceSwitchPopupRef.current &&
        !WorkspaceSwitchPopupRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set default selected when sessionData is available
  useEffect(() => {
    if (sessionData?.length > 0 && !selected) {
      setSelected(sessionData[0]);
      chatId(sessionData[0].id); // send default id to parent
    }
  }, [sessionData]);

  // Filter dashboards based on query
  const filtered =
    query.trim() === ""
      ? sessionData
      : sessionData.filter((ws) =>
        ws.title.toLowerCase().includes(query.trim().toLowerCase())
      );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && filtered.length > 0) {
      setSelected(filtered[0]);
      setQuery("");
      setOpen(false);
    }
  };

  // Notify parent when user changes selection
  useEffect(() => {
    if (selected) chatId(selected.id);
  }, [selected]);

  return (
    <div className="relative w-64" ref={WorkspaceSwitchPopupRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex justify-between items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span
          className="truncate block max-w-[85%] text-left"
          title={selected?.title || "Manage Dashboard"}
        >
          {selected?.title || "Manage Dashboard"}
        </span>
        <FiChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-[9999] mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-md border border-gray-200 bg-blue-50 px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 w-4 h-4 cursor-pointer" />
            </div>
          </div>

          <ul className="max-h-60 overflow-y-auto py-1 text-sm">
            {filtered?.length > 0 ? (
              filtered?.map((workspace) => (
                <li
                  key={workspace.id}
                  onClick={() => {
                    setSelected(workspace);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-gray-100 ${selected?.id === workspace.id ? "bg-gray-100 font-medium" : ""
                    }`}
                >
                  <span className="text-gray-900">{workspace.title}</span>
                  {selected?.id === workspace.id && (
                    <span className="text-green-500">✔</span>
                  )}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
