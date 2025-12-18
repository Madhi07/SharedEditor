import { useState } from "react"
import NewChatSection from "./NewChatSection";
import ChatSessionsPanel from "./ChatSessionsPanel";
import ChatViewer from "./ChatViewer";

export default function ChatsSection() {

  const [showCreateSection, setShowCreateSection] = useState(true);

  const [fetchingField, setFetchingField] = useState({
    chat: {
      status: null,
      message: null
    },
    chatSessions: {
      status: "ok",
      message: null
    },
    chatsData: {
      status: "ok",
      message: null
    }
  });

  return (
    <div className="w-full h-full relative flex">

      <ChatSessionsPanel
        setShowCreateSection={setShowCreateSection}
        fetchingField={fetchingField}
        setFetchingField={setFetchingField}
      />

      {showCreateSection ?
        <NewChatSection
          setShowCreateSection={setShowCreateSection}
          setFetchingField={setFetchingField}
        /> :
        <ChatViewer
          fetchingField={fetchingField}
          setFetchingField={setFetchingField}
        />
      }
    </div>
  )
}
