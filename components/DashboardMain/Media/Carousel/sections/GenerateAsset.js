export const CarouselSlidesAsset = () =>{
    return(
        <div
  id="main-layout"
  className="flex flex-1 h-[calc(100vh-64px)] overflow-hidden"
>
  {/* Left Sidebar: Global Settings */}
  <aside
    id="sidebar-tools"
    className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 z-10"
  >
    <div className="p-5 border-b border-slate-100">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
        Global Design
      </h2>
      {/* Theme Selection */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Theme Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div className="border-2 border-indigo-500 rounded-lg p-2 cursor-pointer bg-indigo-50 text-center">
            <div className="w-full h-8 bg-white rounded mb-1 border border-indigo-100" />
            <span className="text-xs font-medium text-indigo-700">Minimal</span>
          </div>
          <div className="border border-slate-200 rounded-lg p-2 cursor-pointer hover:border-slate-300 text-center">
            <div className="w-full h-8 bg-slate-100 rounded mb-1" />
            <span className="text-xs font-medium text-slate-600">Bold</span>
          </div>
        </div>
      </div>
      {/* Brand Colors */}
      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Brand Colors
        </label>
        <div className="flex gap-2">
          <button className="w-8 h-8 rounded-full bg-[#4f46e5] border-2 border-white shadow-sm ring-2 ring-slate-100" />
          <button className="w-8 h-8 rounded-full bg-[#0ea5e9] border-2 border-white shadow-sm hover:ring-2 hover:ring-slate-100" />
          <button className="w-8 h-8 rounded-full bg-[#f43f5e] border-2 border-white shadow-sm hover:ring-2 hover:ring-slate-100" />
          <button className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400">
            <i className="text-xs" data-fa-i2svg="">
              <svg
                className="svg-inline--fa fa-plus"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="plus"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                />
              </svg>
            </i>
          </button>
        </div>
      </div>
      {/* Typography */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-700 mb-2">
          Typography
        </label>
        <select className="w-full text-sm border-slate-200 rounded-md focus:ring-indigo-500 focus:border-indigo-500 p-2 border bg-slate-50">
          <option>Inter &amp; Roboto</option>
          <option>Montserrat &amp; Open Sans</option>
          <option>Playfair Display</option>
        </select>
      </div>
    </div>
    <div className="p-5 flex-1 overflow-y-auto">
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">
        Add Elements
      </h2>
      <div className="grid grid-cols-3 gap-3">
        <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
          <i className="text-slate-600 mb-2" data-fa-i2svg="">
            <svg
              className="svg-inline--fa fa-font"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="font"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M254 52.8C249.3 40.3 237.3 32 224 32s-25.3 8.3-30 20.8L57.8 416H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32h-1.8l18-48H303.8l18 48H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H390.2L254 52.8zM279.8 304H168.2L224 155.1 279.8 304z"
              />
            </svg>
          </i>
          <span className="text-xs text-slate-600">Text</span>
        </button>
        <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
          <i className="text-slate-600 mb-2" data-fa-i2svg="">
            <svg
              className="svg-inline--fa fa-image"
              aria-hidden="true"
              focusable="false"
              data-prefix="far"
              data-icon="image"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
              />
            </svg>
          </i>
          <span className="text-xs text-slate-600">Image</span>
        </button>
        <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
          <i className="text-slate-600 mb-2" data-fa-i2svg="">
            <svg
              className="svg-inline--fa fa-shapes"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="shapes"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M315.4 15.5C309.7 5.9 299.2 0 288 0s-21.7 5.9-27.4 15.5l-96 160c-5.9 9.9-6.1 22.2-.4 32.2s16.3 16.2 27.8 16.2H384c11.5 0 22.2-6.2 27.8-16.2s5.5-22.3-.4-32.2l-96-160zM288 312V456c0 22.1 17.9 40 40 40H472c22.1 0 40-17.9 40-40V312c0-22.1-17.9-40-40-40H328c-22.1 0-40 17.9-40 40zM128 512a128 128 0 1 0 0-256 128 128 0 1 0 0 256z"
              />
            </svg>
          </i>
          <span className="text-xs text-slate-600">Shape</span>
        </button>
        <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
          <i className="text-slate-600 mb-2" data-fa-i2svg="">
            <svg
              className="svg-inline--fa fa-icons"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="icons"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M500.3 7.3C507.7 13.3 512 22.4 512 32V176c0 26.5-28.7 48-64 48s-64-21.5-64-48s28.7-48 64-48V71L352 90.2V208c0 26.5-28.7 48-64 48s-64-21.5-64-48s28.7-48 64-48V64c0-15.3 10.8-28.4 25.7-31.4l160-32c9.4-1.9 19.1 .6 26.6 6.6zM74.7 304l11.8-17.8c5.9-8.9 15.9-14.2 26.6-14.2h61.7c10.7 0 20.7 5.3 26.6 14.2L213.3 304H240c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V352c0-26.5 21.5-48 48-48H74.7zM192 408a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM478.7 278.3L440.3 368H496c6.7 0 12.6 4.1 15 10.4s.6 13.3-4.4 17.7l-128 112c-5.6 4.9-13.9 5.3-19.9 .9s-8.2-12.4-5.3-19.2L391.7 400H336c-6.7 0-12.6-4.1-15-10.4s-.6-13.3 4.4-17.7l128-112c5.6-4.9 13.9-5.3 19.9-.9s8.2 12.4 5.3 19.2zm-339-59.2c-6.5 6.5-17 6.5-23 0L19.9 119.2c-28-29-26.5-76.9 5-103.9c27-23.5 68.4-19 93.4 6.5l10 10.5 9.5-10.5c25-25.5 65.9-30 93.9-6.5c31 27 32.5 74.9 4.5 103.9l-96.4 99.9z"
              />
            </svg>
          </i>
          <span className="text-xs text-slate-600">Icon</span>
        </button>
        <button className="flex flex-col items-center justify-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
          <i className="text-indigo-500 mb-2" data-fa-i2svg="">
            <svg
              className="svg-inline--fa fa-wand-magic-sparkles"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="wand-magic-sparkles"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"
              />
            </svg>
          </i>
          <span className="text-xs text-indigo-600 font-medium">AI Gen</span>
        </button>
      </div>
    </div>
  </aside>
  {/* Center: Slide List Editor */}
  <main
    id="slide-editor-area"
    className="flex-1 bg-slate-100 overflow-y-auto p-8 relative"
  >
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Slide 1 */}
      <div
        id="slide-1"
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row h-auto group relative"
      >
        {/* Drag Handle (Left) */}
        <div className="w-full md:w-8 bg-slate-50 border-r border-slate-100 flex items-center justify-center cursor-move hover:bg-slate-100 transition-colors">
          <i className="text-slate-300" data-fa-i2svg="">
            <svg
              className="svg-inline--fa fa-grip-vertical"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="grip-vertical"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"
              />
            </svg>
          </i>
        </div>
        {/* Preview Area */}
        <div className="w-full md:w-64 h-64 md:h-auto bg-slate-50 relative shrink-0 border-r border-slate-100">
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-medium">
            Slide 1
          </div>
          <div className="w-full h-full p-6 flex items-center justify-center">
            {/* Simulated Slide Content */}
            <div className="w-full aspect-square bg-indigo-600 rounded-lg shadow-lg relative overflow-hidden flex flex-col p-4 text-white">
              <h3 className="text-lg font-bold leading-tight mb-2">
                5 Secrets to Growth
              </h3>
              <p className="text-xs opacity-80">Unlock your potential today.</p>
              <div className="mt-auto flex justify-between items-center">
                <div className="w-6 h-6 rounded-full bg-white/20" />
                <i className="text-xs" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-arrow-right"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="arrow-right"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"
                    />
                  </svg>
                </i>
              </div>
            </div>
          </div>
          {/* Quick Actions Overlay */}
          <div className="absolute bottom-3 left-0 w-full flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="bg-white text-slate-700 p-1.5 rounded-md shadow hover:text-indigo-600 text-xs"
              title="Regenerate"
            >
              <i data-fa-i2svg="">
                <svg
                  className="svg-inline--fa fa-arrows-rotate"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="arrows-rotate"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"
                  />
                </svg>
              </i>
            </button>
            <button
              className="bg-white text-slate-700 p-1.5 rounded-md shadow hover:text-indigo-600 text-xs"
              title="Duplicate"
            >
              <i data-fa-i2svg="">
                <svg
                  className="svg-inline--fa fa-copy"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="copy"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M448 384H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64H396.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V320c0 35.3-28.7 64-64 64zM64 128h96v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H256c8.8 0 16-7.2 16-16V416h48v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64z"
                  />
                </svg>
              </i>
            </button>
            <button
              className="bg-white text-slate-700 p-1.5 rounded-md shadow hover:text-red-600 text-xs"
              title="Delete"
            >
              <i data-fa-i2svg="">
                <svg
                  className="svg-inline--fa fa-trash-can"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="trash-can"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"
                  />
                </svg>
              </i>
            </button>
          </div>
        </div>
        {/* Editor Area */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Cover Slide</h3>
              <p className="text-xs text-slate-500">
                Main hook and introduction
              </p>
            </div>
            <div className="flex gap-2">
              <button className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                <i className="mr-1" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-wand-magic-sparkles"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="wand-magic-sparkles"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"
                    />
                  </svg>
                </i>{" "}
                Regenerate
              </button>
            </div>
          </div>
          {/* Content Inputs */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Title
              </label>
              <input
                type="text"
                defaultValue="5 Secrets to Growth"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Subtitle
              </label>
              <input
                type="text"
                defaultValue="Unlock your potential today."
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>
          {/* Asset Tools */}
          <div className="mt-auto border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Background Asset
              </span>
              <div className="flex gap-2">
                <button
                  className="text-slate-400 hover:text-indigo-600 transition-colors text-sm"
                  title="Replace"
                >
                  <i data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-image"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="image"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
                      />
                    </svg>
                  </i>
                </button>
                <button
                  className="text-slate-400 hover:text-indigo-600 transition-colors text-sm"
                  title="Crop"
                >
                  <i data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-crop-simple"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="crop-simple"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M128 32c0-17.7-14.3-32-32-32S64 14.3 64 32V64H32C14.3 64 0 78.3 0 96s14.3 32 32 32H64V384c0 35.3 28.7 64 64 64H352V384H128V32zM384 480c0 17.7 14.3 32 32 32s32-14.3 32-32V448h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H448l0-256c0-35.3-28.7-64-64-64L160 64v64l224 0 0 352z"
                      />
                    </svg>
                  </i>
                </button>
                <button
                  className="text-slate-400 hover:text-indigo-600 transition-colors text-sm"
                  title="Adjust"
                >
                  <i data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-sliders"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="sliders"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
                      />
                    </svg>
                  </i>
                </button>
                <button
                  className="text-slate-400 hover:text-indigo-600 transition-colors text-sm"
                  title="Upload"
                >
                  <i data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-upload"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="upload"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"
                      />
                    </svg>
                  </i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Slide 2 (Text Heavy) */}
      <div
        id="slide-2"
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row h-auto group relative"
      >
        <div className="w-full md:w-8 bg-slate-50 border-r border-slate-100 flex items-center justify-center cursor-move hover:bg-slate-100 transition-colors">
          <i className="text-slate-300" data-fa-i2svg="">
            <svg
              className="svg-inline--fa fa-grip-vertical"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="grip-vertical"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"
              />
            </svg>
          </i>
        </div>
        <div className="w-full md:w-64 h-64 md:h-auto bg-slate-50 relative shrink-0 border-r border-slate-100">
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-medium">
            Slide 2
          </div>
          <div className="w-full h-full p-6 flex items-center justify-center">
            <div className="w-full aspect-square bg-white border border-slate-200 rounded-lg shadow-sm relative overflow-hidden flex flex-col p-4">
              <h4 className="text-sm font-bold text-slate-800 mb-2">
                1. Start Early
              </h4>
              <p className="text-[10px] text-slate-600 leading-relaxed">
                The best time to plant a tree was 20 years ago. The second best
                time is now.
              </p>
              <div className="mt-auto w-full h-16 bg-slate-100 rounded overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d593726762-50337b56f26fe796bc1a.png"
                  alt="minimalist line art illustration of a clock or hourglass, vector style, blue and grey"
                />
              </div>
            </div>
          </div>
          {/* Quick Actions Overlay */}
          <div className="absolute bottom-3 left-0 w-full flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-white text-slate-700 p-1.5 rounded-md shadow hover:text-indigo-600 text-xs">
              <i data-fa-i2svg="">
                <svg
                  className="svg-inline--fa fa-arrows-rotate"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="arrows-rotate"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"
                  />
                </svg>
              </i>
            </button>
            <button className="bg-white text-slate-700 p-1.5 rounded-md shadow hover:text-indigo-600 text-xs">
              <i data-fa-i2svg="">
                <svg
                  className="svg-inline--fa fa-copy"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="copy"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M448 384H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64H396.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V320c0 35.3-28.7 64-64 64zM64 128h96v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H256c8.8 0 16-7.2 16-16V416h48v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64z"
                  />
                </svg>
              </i>
            </button>
            <button className="bg-white text-slate-700 p-1.5 rounded-md shadow hover:text-red-600 text-xs">
              <i data-fa-i2svg="">
                <svg
                  className="svg-inline--fa fa-trash-can"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="trash-can"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"
                  />
                </svg>
              </i>
            </button>
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Content Slide
              </h3>
              <p className="text-xs text-slate-500">
                Point #1 with illustration
              </p>
            </div>
            <div className="flex gap-2">
              <button className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                <i className="mr-1" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-wand-magic-sparkles"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="wand-magic-sparkles"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"
                    />
                  </svg>
                </i>{" "}
                Regenerate
              </button>
            </div>
          </div>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Heading
              </label>
              <input
                type="text"
                defaultValue="1. Start Early"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Body Text
              </label>
              <textarea
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all h-20 resize-none"
                defaultValue={
                  "The best time to plant a tree was 20 years ago. The second best time is now."
                }
              />
            </div>
          </div>
          <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 relative group/img">
                <img
                  className="w-full h-full object-cover"
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d593726762-50337b56f26fe796bc1a.png"
                  alt="minimalist line art illustration of a clock or hourglass, vector style, blue and grey"
                />
                <div className="absolute inset-0 bg-black/40 hidden group-hover/img:flex items-center justify-center cursor-pointer">
                  <i className="text-white text-xs" data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-pencil"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="pencil"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
                      />
                    </svg>
                  </i>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700">
                  Illustration
                </p>
                <p className="text-[10px] text-slate-400">
                  Vector Art • 100% Scale
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors text-xs flex items-center gap-1 border border-slate-200">
                <i data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-wand-magic-sparkles"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="wand-magic-sparkles"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"
                    />
                  </svg>
                </i>{" "}
                AI Replace
              </button>
              <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors text-xs border border-slate-200">
                <i data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-upload"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="upload"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"
                    />
                  </svg>
                </i>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Slide 3 (Image Heavy) */}
      <div
        id="slide-3"
        className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col md:flex-row h-auto group relative"
      >
        <div className="w-full md:w-8 bg-slate-50 border-r border-slate-100 flex items-center justify-center cursor-move hover:bg-slate-100 transition-colors">
          <i className="text-slate-300" data-fa-i2svg="">
            <svg
              className="svg-inline--fa fa-grip-vertical"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="grip-vertical"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 320 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"
              />
            </svg>
          </i>
        </div>
        <div className="w-full md:w-64 h-64 md:h-auto bg-slate-50 relative shrink-0 border-r border-slate-100">
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded font-medium">
            Slide 3
          </div>
          <div className="w-full h-full p-6 flex items-center justify-center">
            <div className="w-full aspect-square bg-slate-900 rounded-lg shadow-sm relative overflow-hidden">
              <img
                className="w-full h-full object-cover opacity-60"
                src="https://storage.googleapis.com/uxpilot-auth.appspot.com/9feab6c4da-9664163cb2dfab980678.png"
                alt="business meeting in a modern glass office with diverse team, cinematic lighting"
              />
              <div className="absolute inset-0 p-4 flex flex-col justify-end">
                <h4 className="text-white font-bold text-lg leading-tight">
                  Collaboration is Key
                </h4>
              </div>
            </div>
          </div>
          {/* Quick Actions Overlay */}
          <div className="absolute bottom-3 left-0 w-full flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-white text-slate-700 p-1.5 rounded-md shadow hover:text-indigo-600 text-xs">
              <i data-fa-i2svg="">
                <svg
                  className="svg-inline--fa fa-arrows-rotate"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="arrows-rotate"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z"
                  />
                </svg>
              </i>
            </button>
            <button className="bg-white text-slate-700 p-1.5 rounded-md shadow hover:text-indigo-600 text-xs">
              <i data-fa-i2svg="">
                <svg
                  className="svg-inline--fa fa-copy"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="copy"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M448 384H256c-35.3 0-64-28.7-64-64V64c0-35.3 28.7-64 64-64H396.1c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9V320c0 35.3-28.7 64-64 64zM64 128h96v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H256c8.8 0 16-7.2 16-16V416h48v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192c0-35.3 28.7-64 64-64z"
                  />
                </svg>
              </i>
            </button>
            <button className="bg-white text-slate-700 p-1.5 rounded-md shadow hover:text-red-600 text-xs">
              <i data-fa-i2svg="">
                <svg
                  className="svg-inline--fa fa-trash-can"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="trash-can"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"
                  />
                </svg>
              </i>
            </button>
          </div>
        </div>
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Visual Slide</h3>
              <p className="text-xs text-slate-500">
                Full background image with overlay
              </p>
            </div>
            <div className="flex gap-2">
              <button className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                <i className="mr-1" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-wand-magic-sparkles"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="wand-magic-sparkles"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"
                    />
                  </svg>
                </i>{" "}
                Regenerate
              </button>
            </div>
          </div>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">
                Overlay Text
              </label>
              <input
                type="text"
                defaultValue="Collaboration is Key"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
            {/* Image Editor Mini Toolbar */}
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">
                Image Adjustments
              </label>
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-slate-500">
                      Brightness
                    </span>
                    <span className="text-[10px] text-slate-700">60%</span>
                  </div>
                  <input
                    type="range"
                    className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
                <div className="w-px h-8 bg-slate-200" />
                <div className="flex gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-slate-500 transition-all"
                    title="Blur"
                  >
                    <i data-fa-i2svg="">
                      <svg
                        className="svg-inline--fa fa-droplet"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="droplet"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"
                        />
                      </svg>
                    </i>
                  </button>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-slate-500 transition-all"
                    title="Crop"
                  >
                    <i data-fa-i2svg="">
                      <svg
                        className="svg-inline--fa fa-crop"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="crop"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        data-fa-i2svg=""
                      >
                        <path
                          fill="currentColor"
                          d="M448 109.3l54.6-54.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L402.7 64 160 64v64l178.7 0L128 338.7V32c0-17.7-14.3-32-32-32S64 14.3 64 32V64H32C14.3 64 0 78.3 0 96s14.3 32 32 32H64V384c0 35.3 28.7 64 64 64H352V384H173.3L384 173.3 384 480c0 17.7 14.3 32 32 32s32-14.3 32-32V448h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H448l0-274.7z"
                        />
                      </svg>
                    </i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-auto border-t border-slate-100 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 relative group/img">
                <img
                  className="w-full h-full object-cover"
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/9feab6c4da-f38d83f579ba1230113a.png"
                  alt="business meeting in a modern glass office with diverse team, cinematic lighting"
                />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-700">
                  Background Image
                </p>
                <p className="text-[10px] text-green-600 flex items-center gap-1">
                  <i data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-circle-check"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="circle-check"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                      />
                    </svg>
                  </i>{" "}
                  High Res
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 bg-indigo-600 text-white rounded-lg text-xs hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200">
                Change Image
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Add New Slide Button */}
      <button className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all group">
        <span className="flex items-center gap-2 font-medium">
          <i
            className="text-lg group-hover:scale-110 transition-transform"
            data-fa-i2svg=""
          >
            <svg
              className="svg-inline--fa fa-circle-plus"
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="circle-plus"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              data-fa-i2svg=""
            >
              <path
                fill="currentColor"
                d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"
              />
            </svg>
          </i>{" "}
          Add New Slide
        </span>
      </button>
    </div>
  </main>
  {/* Right Sidebar: Properties & AI Chat */}
  <aside
    id="sidebar-properties"
    className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10"
  >
    {/* Tabs */}
    <div className="flex border-b border-slate-200">
      <button className="flex-1 py-3 text-sm font-medium text-indigo-600 border-b-2 border-indigo-600 transition-colors">
        <i className="mr-2" data-fa-i2svg="">
          <svg
            className="svg-inline--fa fa-sliders"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="sliders"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"
            />
          </svg>
        </i>
        Properties
      </button>
      <button className="flex-1 py-3 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
        <i className="mr-2" data-fa-i2svg="">
          <svg
            className="svg-inline--fa fa-wand-magic-sparkles"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="wand-magic-sparkles"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"
            />
          </svg>
        </i>
        AI Assistant
      </button>
    </div>
    {/* Properties Panel */}
    <div className="flex-1 overflow-y-auto p-5">
      <div className="space-y-6">
        {/* Selected Element Info */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <i className="text-indigo-600" data-fa-i2svg="">
              <svg
                className="svg-inline--fa fa-layer-group"
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="layer-group"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 576 512"
                data-fa-i2svg=""
              >
                <path
                  fill="currentColor"
                  d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"
                />
              </svg>
            </i>
            <span className="text-sm font-semibold text-indigo-900">
              Slide 1 Selected
            </span>
          </div>
          <p className="text-xs text-indigo-700">Cover Slide • 1080×1080px</p>
        </div>
        {/* Text Properties */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Typography
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Font Family
              </label>
              <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                <option>Inter</option>
                <option>Roboto</option>
                <option>Montserrat</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Size
                </label>
                <input
                  type="number"
                  defaultValue={24}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Weight
                </label>
                <select className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white">
                  <option>Bold</option>
                  <option>Medium</option>
                  <option>Regular</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Alignment
              </label>
              <div className="flex gap-2">
                <button className="flex-1 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <i data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-align-left"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="align-left"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M288 64c0 17.7-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32H256c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H256c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
                      />
                    </svg>
                  </i>
                </button>
                <button className="flex-1 py-2 border-2 border-indigo-500 bg-indigo-50 rounded-lg text-sm text-indigo-600">
                  <i data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-align-center"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="align-center"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M352 64c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H320c17.7 0 32-14.3 32-32zm96 128c0-17.7-14.3-32-32-32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32zM0 448c0 17.7 14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H32c-17.7 0-32 14.3-32 32zM352 320c0-17.7-14.3-32-32-32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32H320c17.7 0 32-14.3 32-32z"
                      />
                    </svg>
                  </i>
                </button>
                <button className="flex-1 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm">
                  <i data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-align-right"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="align-right"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M448 64c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32zm0 256c0 17.7-14.3 32-32 32H192c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32zM0 192c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
                      />
                    </svg>
                  </i>
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Background Properties */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Background
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button className="py-2 px-3 border-2 border-indigo-500 bg-indigo-50 rounded-lg text-xs font-medium text-indigo-600">
                  <i className="mr-1" data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-fill-drip"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="fill-drip"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M41.4 9.4C53.9-3.1 74.1-3.1 86.6 9.4L168 90.7l53.1-53.1c28.1-28.1 73.7-28.1 101.8 0L474.3 189.1c28.1 28.1 28.1 73.7 0 101.8L283.9 481.4c-37.5 37.5-98.3 37.5-135.8 0L30.6 363.9c-37.5-37.5-37.5-98.3 0-135.8L122.7 136 41.4 54.6c-12.5-12.5-12.5-32.8 0-45.3zm176 221.3L168 181.3 75.9 273.4c-4.2 4.2-7 9.3-8.4 14.6H386.7l42.3-42.3c3.1-3.1 3.1-8.2 0-11.3L277.7 82.9c-3.1-3.1-8.2-3.1-11.3 0L213.3 136l49.4 49.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0zM512 512c-35.3 0-64-28.7-64-64c0-25.2 32.6-79.6 51.2-108.7c6-9.4 19.5-9.4 25.5 0C543.4 368.4 576 422.8 576 448c0 35.3-28.7 64-64 64z"
                      />
                    </svg>
                  </i>
                  Color
                </button>
                <button className="py-2 px-3 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">
                  <i className="mr-1" data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-image"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="image"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"
                      />
                    </svg>
                  </i>
                  Image
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  defaultValue="#4f46e5"
                  className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  defaultValue="#4f46e5"
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Spacing */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Spacing
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Padding
              </label>
              <input
                type="number"
                defaultValue={16}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Margin
              </label>
              <input
                type="number"
                defaultValue={8}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Quick Actions Footer */}
    <div className="border-t border-slate-200 p-4">
      <button className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium text-sm hover:shadow-lg transition-all flex items-center justify-center gap-2">
        <i data-fa-i2svg="">
          <svg
            className="svg-inline--fa fa-wand-magic-sparkles"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="wand-magic-sparkles"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"
            />
          </svg>
        </i>
        Apply AI Magic
      </button>
    </div>
  </aside>
</div>


    )

}