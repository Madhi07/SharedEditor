import clsx from "clsx";
import { FaArrowUp } from "react-icons/fa";

export default function ChatInputArea({
    containerClassName = "",
    inputValue = "",
    onInputValueChange,
    onInputKeyDown,
    onSendClick,
    sendButtonDisabled = false,
    inputClassName = "",
    sendButtonClassName = ""
}) {
    return (
        
        <div
            className={clsx(containerClassName)}
        >
            <div className="flex flex-col flex-1"
                style={{ pointerEvents: "all" }}
            >
                <div className="relative ">
                    <textarea
                        placeholder="Ask anything..."
                        className={clsx(inputClassName)}
                        spellCheck="true"
                        value={inputValue}
                        onChange={onInputValueChange}
                        onInput={(e) => {
                            e.target.style.height = "auto";
                            e.target.style.height = e.target.scrollHeight + "px";
                        }}
                        rows={1}
                        onKeyDown={onInputKeyDown}
                        autoFocus
                    />
                </div>
            </div>
            <div className="flex items-center gap-1.5 p-2">
                <div className="ml-auto flex items-center gap-3">
                    <button
                        onClick={onSendClick}
                        id="bg-composer-submit-btn"
                        className={clsx(sendButtonClassName)}
                        disabled={sendButtonDisabled}
                    >
                        <FaArrowUp />
                    </button>
                </div>
            </div>
        </div>
    )
}
