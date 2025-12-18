import { useFlow } from "@/context/FlowContext";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { FaTimes, FaUpload } from "react-icons/fa";

export default function ActionSidebar() {
  const { onAddNode, onDelete, edges, nodeId, nodes } = useFlow();
  const [selected, setSelected] = useState({});
  const [selectedAction, setSelectedAction] = useState(null);
  const [tokens, setTokens] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [actionsOptions, setActionsOptions] = useState([]);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const router = useRouter();
  const { index } = router.query;

  // Fetch integrations from backend
  useEffect(() => {
    async function fetchIntegrations() {
      try {
        const response = await fetch("https://agentzee-workflow-api.episyche.com/integrations/list");
        const data = await response.json();
        setActionsOptions(data);
      } catch (err) {
        console.error("Error fetching integrations:", err);
      }
    }
    fetchIntegrations();
  }, []);

  const handleAuth = async (provider) => {
    try {
      const res = await fetch(`/api/get-token?provider=${provider}`);
      const data = await res.json();

      if (res.ok && data.accessToken) {
        setTokens((prev) => ({
          ...prev,
          [provider]: {
            access: data.accessToken,
            refresh: data.refreshToken,
          },
        }));

        // Send tokens to backend
        const response = await fetch("https://agentzee-workflow-api.episyche.com/user-integrations/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: "d713b249-42b5-4cb0-98a5-3089ee564560",
            workflow_id: index,
            integration_id: selected.id,
            access_token: data.accessToken,
            refresh_token: data.refreshToken,
          }),
        });

        const result = await response.json();
        
        if (selectedAction) {
          onAddNode(nodeId, "dynamic", {
            ...selected,
            action: selectedAction,
            user_integration_id: result.workflow_id,
            config: inputValues,
            handles: selected.handles || []
          });
        }
        
        setSelected({});
        setSelectedAction(null);
        setInputValues({});
      } else {
        openLinkedAccount(provider);
      }
    } catch (err) {
      console.error("Error fetching token:", err);
    }
  };

  useEffect(() => {
    function handleMessage(event) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "sso_done") {
        const { accessToken, refreshToken, providerId } = event.data;
        setTokens((prev) => ({
          ...prev,
          [providerId]: {
            access: accessToken || "",
            refresh: refreshToken || "",
          },
        }));

        if (providerId) {
          localStorage.setItem(`${providerId}_accessToken`, accessToken || "");
          localStorage.setItem(`${providerId}_refreshToken`, refreshToken || "");
        }
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const openLinkedAccount = (type) => {
    const popup = window.open(
      `/api/oauth/login?provider=${type}`,
      "ssoPopup",
      "width=600,height=700"
    );

    const poll = setInterval(() => {
      if (popup.closed) {
        clearInterval(poll);
        console.log("Popup closed, check server for login status...");
      }
    }, 500);
  };

  const handleInputChange = (name, value) => {
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileUpload = async (fieldName, file) => {
    if (!file) return;

    setUploadingFiles((prev) => ({ ...prev, [fieldName]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://agentzee-workflow-api.episyche.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        handleInputChange(fieldName, data.url);
      } else {
        console.error("Upload failed:", data);
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const parseParameters = (paramsString) => {
    try {
      const params = JSON.parse(paramsString);
      return Object.entries(params).filter(
        ([key]) => key !== "user_id" && key !== "workflow_id"
      );
    } catch (err) {
      console.error("Error parsing parameters:", err);
      return [];
    }
  };

  const renderInputField = (fieldName, fieldType) => {
    const isFileUpload = fieldName.includes("image") || 
                        fieldName.includes("media") || 
                        fieldName.includes("file") ||
                        fieldName.includes("url") && (fieldName.includes("image") || fieldName.includes("media"));

    if (isFileUpload) {
      return (
        <div>
          <label className="text-gray-300 text-sm block mb-2">
            {fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={inputValues[fieldName] || ""}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              placeholder="Enter URL or upload file"
              className="w-full bg-gray-700 text-white px-3 py-2 rounded outline-none"
            />
            <label className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer">
              <FaUpload />
              <span>{uploadingFiles[fieldName] ? "Uploading..." : "Upload File"}</span>
              <input
                type="file"
                onChange={(e) => handleFileUpload(fieldName, e.target.files[0])}
                className="hidden"
                disabled={uploadingFiles[fieldName]}
              />
            </label>
          </div>
        </div>
      );
    }

    if (fieldType === "list" || fieldName.includes("values") || fieldName.includes("urls")) {
      return (
        <div>
          <label className="text-gray-300 text-sm block mb-2">
            {fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </label>
          <textarea
            value={inputValues[fieldName] || ""}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            // placeholder="Enter as JSON array, e.g., [\"item1\", \"item2\"]"
            className="w-full bg-gray-700 text-white px-3 py-2 rounded outline-none min-h-[80px]"
          />
        </div>
      );
    }

    if (fieldType === "integer") {
      return (
        <div>
          <label className="text-gray-300 text-sm block mb-2">
            {fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </label>
          <input
            type="number"
            value={inputValues[fieldName] || ""}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded outline-none"
          />
        </div>
      );
    }

    if (fieldType === "float") {
      return (
        <div>
          <label className="text-gray-300 text-sm block mb-2">
            {fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </label>
          <input
            type="number"
            step="0.01"
            value={inputValues[fieldName] || ""}
            onChange={(e) => handleInputChange(fieldName, e.target.value)}
            className="w-full bg-gray-700 text-white px-3 py-2 rounded outline-none"
          />
        </div>
      );
    }

    return (
      <div>
        <label className="text-gray-300 text-sm block mb-2">
          {fieldName.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </label>
        <input
          type="text"
          value={inputValues[fieldName] || ""}
          onChange={(e) => handleInputChange(fieldName, e.target.value)}
          className="w-full bg-gray-700 text-white px-3 py-2 rounded outline-none"
        />
      </div>
    );
  };

  const handleSaveNode = () => {
    if (!selectedAction) return;

    onAddNode(nodeId, "dynamic", {
      ...selected,
      action: selectedAction,
      config: inputValues,
      handles: selected.handles || []
    });

    setSelected({});
    setSelectedAction(null);
    setInputValues({});
  };

  return (
    <div className="p-4 space-y-2 h-[100%]">
      {actionsOptions.map((app) => (
        <div
          onClick={() => {
            setSelected(app);
            setSelectedAction(null);
            setInputValues({});
          }}
          key={app.id}
          className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
        >
          <Image src={app.icon} alt={app.name} width={24} height={24} unoptimized />
          <span className="font-medium text-gray-800">{app.name}</span>
        </div>
      ))}

      {Object.keys(selected).length !== 0 && !selectedAction && (
        <div className="fixed right-0 top-0 w-80 min-h-screen h-[auto] bg-gray-800 border-l border-gray-700 z-40 p-6 ">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-lg font-bold">Select Action</h2>
            <button onClick={() => setSelected({})} className="text-gray-400 hover:text-white">
              <FaTimes />
            </button>
          </div>

          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded flex items-center justify-center">
              <Image src={selected.icon} alt={selected.name} width={24} height={24} unoptimized />
            </div>
            <div>
              <div className="text-white font-medium">{selected.name}</div>
            </div>
          </div>

          <div className="space-y-2">
            {selected.actions && selected.actions.length > 0 ? (
              selected.actions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => {
                    setSelectedAction(action);
                    setInputValues({});
                  }}
                  className="p-3 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer transition-colors"
                >
                  <div className="text-white font-medium">{action.action_name}</div>
                  <div className="text-gray-400 text-sm mt-1">{action.description}</div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center py-4">No actions available for this integration</div>
            )}
          </div>
        </div>
      )}

      {Object.keys(selected).length !== 0 && selectedAction && (
        <div className="fixed right-0 top-0 w-80 min-h-screen h-[auto] bg-gray-800 border-l border-gray-700 z-50 p-6 ">
          <div className="flex items-center justify-between mb-6  px-[10px]">
            <h2 className="text-white text-lg font-bold">Configure Action</h2>
            <button
              onClick={() => {
                setSelectedAction(null);
                setInputValues({});
              }}
              className="text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>

          <div className="flex items-center space-x-3 px- mb-6  px-[10px]">
            <div className="w-10 h-10 rounded flex items-center justify-center">
              <Image src={selected.icon} alt={selected.name} width={24} height={24} unoptimized />
            </div>
            <div>
              <div className="text-white font-medium">{selectedAction.action_name}</div>
              <div className="text-gray-400 text-sm">{selectedAction.description}</div>
            </div>
          </div>

          <div className="space-y-4 px-[10px]">
            {selected.oauth ? (
              <>
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Access Token</label>
                  <input
                    type="text"
                    value={tokens[selected.provider_id]?.access || ""}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded outline-none"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Refresh Token</label>
                  <input
                    type="text"
                    value={tokens[selected.provider_id]?.refresh || ""}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded outline-none"
                    readOnly
                  />
                </div>

                {parseParameters(selectedAction.parameters).map(([fieldName, fieldType]) => (
                  <div key={fieldName}>{renderInputField(fieldName, fieldType)}</div>
                ))}

                <button
                  onClick={() => handleAuth(selected.provider_id)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Image src={selected.icon} alt={selected.name} width={24} height={24} unoptimized />
                  <span>{tokens[selected.provider_id]?.access ? "Submit" : "Sign in"}</span>
                </button>
              </>
            ) : (
              <>
                {parseParameters(selectedAction.parameters).map(([fieldName, fieldType]) => (
                  <div key={fieldName}>{renderInputField(fieldName, fieldType)}</div>
                ))}

                <button
                  onClick={handleSaveNode}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Save Node
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}