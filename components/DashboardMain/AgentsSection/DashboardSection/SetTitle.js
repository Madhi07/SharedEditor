import { dashboard } from "@/constants/apiPaths"
import { createOrUpdate } from "@/utils/fetchUtils"
import { Fragment, useState } from "react"


export default function AddTitle({ popupRef, setShowExportPopup, handleAddTile, setInput }) {

  const setTitle = () => {
    handleAddTile()
  }



  return (
    <Fragment>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"  >
        <div className="bg-white p-4 rounded-lg w-[400px]  h-[200px] relative" ref={popupRef}>
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            onClick={() => setShowExportPopup(false)}
          >
            ✕
          </button>
          <h2 className="text-lg text-center font-semibold mb-4"> Set Title</h2>
          <input className="w-full pl-5 h-[50px] outline-0 border border-gray-200 rounded-md" onChange={((e) => { setInput(e.target.value) })} />
          <div className="flex mt-6 justify-center items-center">
            <button className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-md" onClick={(() => { setTitle() })}>Submit</button>
          </div>
        </div>
      </div>
    </Fragment>
  )
}