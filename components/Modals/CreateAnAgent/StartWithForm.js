import { DialogPanel } from "@headlessui/react";
import { FaArrowLeft, FaCheck, FaTimes } from "react-icons/fa";
import { channelTypes, examples } from "./constants";
import clsx from "clsx";
import ModalLayout from "..";

export default function StartWithForm({ open, onClose, data, setData, submitClick }) {
  return (
    <ModalLayout open={open} onClose={onClose}>
      <DialogPanel
        transition
        className="bg-light-purple rounded-2xl max-w-2xl p-8 md:p-12 text-left relative transform shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
      >

        <div className="flex justify-between items-center mb-8">
          <button className="flex items-center text-primary hover:text-primary/80 transition-colors">
            <FaArrowLeft className="mr-2" />
            <span className="font-medium">Back</span>
          </button>
          <button
            onClick={onClose}
            type='button'
            aria-label="Close"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>


        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Describe the agent</h1>
          <p className="text-lg text-gray-600">Briefly describe the AI Agent you want to create</p>
        </div>


        <div className="mb-8">
          <textarea
            autoFocus
            value={data?.description || ''}
            onChange={(e) => setData({ description: e.target.value })}
            placeholder="Describe your AI agent's purpose, personality, and knowledge base. For example: A friendly customer support agent that can answer questions about our products, process returns, and handle basic troubleshooting."
            className="w-full h-40 p-4 rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-gray-700 placeholder-gray-400 resize-none transition-all"
          ></textarea>
        </div>


        <div className="mb-10">
          <p className="text-sm text-gray-500 mb-3">Examples:</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <span
                key={index}
                className="bg-white px-4 py-2 rounded-full text-sm text-gray-700 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {example}
              </span>
            ))}
          </div>
        </div>


        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Channel type</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {channelTypes.map((channel) => (
              <button
                key={channel.id}
                className={clsx("bg-white rounded-xl p-4 flex flex-col items-center cursor-pointer relative overflow-hidden",
                  data?.channelType === channel.id ? "border-primary border-2" : "border border-gray-200 hover:border-primary/50 transition-all"
                )}
                onClick={() => setData({ channelType: channel.id })}
                disabled={data?.channelType === channel.id}
              >
                {data?.channelType === channel.id && (
                  <div className="absolute top-0 right-0 bg-primary text-white p-1 rounded-bl-lg">
                    <FaCheck className="text-xs" />
                  </div>
                )}
                <div className={clsx("w-12 h-12 rounded-full flex items-center justify-center mb-3",
                  data?.channelType === channel.id ? "bg-primary/10" : "bg-gray-100"
                )}>
                  <channel.icon className={clsx("text-xl",
                    data?.channelType === channel.id ? 'text-primary' : 'text-gray-500')}
                  />
                </div>
                <span className="text-gray-800 font-medium">
                  {channel.name}
                </span>
              </button>
            ))}
          </div>
        </div>


        <div className="mt-10 flex justify-end">
          <button
            onClick={submitClick}
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 py-3 rounded-full text-white font-medium"
          >
            Next
          </button>
        </div>

      </DialogPanel>
    </ModalLayout>
  )
}
