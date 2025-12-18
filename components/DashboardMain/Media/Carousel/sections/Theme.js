import { useState } from "react"
import { FaRegImage } from "react-icons/fa"
import { FaCircleCheck, FaPlus, FaRegCircleCheck } from "react-icons/fa6"
import ColorPicker from "../colorPallet";




export const themeImages = [
    {
        name: "Theme 1",
        img: "/media/carousel/carousel-theme-1.png",
    },
    {
        name: "Theme 2",
        img: "/media/carousel/carousel-them-2.png",
    },
    {
        name: "Theme 3",
        img: "/media/carousel/carousel-theme-3.png",
    },
    {
        name: "Theme 4",
        img: "/media/carousel/carousel-theme-4.png",
    },
    {
        name: "Theme 5",
        img: "/media/carousel/carousel-theme-5 (2).png",
    },
    {
        name: "Theme 6",
        img: "/media/carousel/carousel-theme-6.png",
    },
];

export const ThemeSelector = () => {
    const [themeBackgoundToggler, setThemeBackgroundToggler] = useState({ theme: true, background: false })
    const [colorPickerValue, setColorPicker] = useState(false)



    return (
        <div id="workspace" className="flex-1 flex overflow-y-auto h-screen">
            {/* Left: Settings Panel */}
            <div
                id="settings-panel"
                className="w-full  xl:w-7/12 overflow-y-auto  p-3  space-y-8 scroll-smooth pb-32"
            >
                <div className="flex p-1 bg-slate-100 rounded-lg mb-4">
                    <button onClick={() => setThemeBackgroundToggler((prev) => ({ ...prev, theme: true, background: false }))}
                        className={`flex-1 py-1.5 text-xs font-medium  ${themeBackgoundToggler.theme ? " text-slate-700  bg-white shadow-sm rounded-md" : "text-slate-500 hover:text-slate-700"}`}>
                        Theme
                    </button>
                    <button onClick={() => setThemeBackgroundToggler((prev) => ({ ...prev, background: true, theme: false }))}
                        className={`flex-1 py-1.5 text-xs font-medium${themeBackgoundToggler.background ? " text-slate-700  bg-white shadow-sm rounded-md" : "text-slate-500 hover:text-slate-700"}`}>
                        Background
                    </button>

                </div>
                {/* 1. Theme Selection */}
                <section id="section-themes" className="space-y-4">
                    {themeBackgoundToggler.theme ? (
                        <>
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-800">Choose a Theme</h2>
                                <a className="text-sm text-brand-600 font-medium hover:underline">
                                    View all
                                </a>
                            </div>

                            {/* Theme Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {themeImages.slice(0, 3).map((item, i) => (
                                    <div key={i} className="group relative cursor-pointer">
                                        <div className="absolute inset-0 bg-gray-200 rounded-2xl opacity-0 transition-opacity group-hover:opacity-100 translate-y-1 translate-x-1" />
                                        <div className="relative bg-white border border-gray-200 rounded-2xl p-3 h-full hover:border-brand-300 transition-all">
                                            <div className="h-24 overflow-hidden rounded-lg mb-3 bg-slate-100">
                                                <img
                                                    src={item.img}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-sm text-slate-600">
                                                    {item.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* ---------------- BACKGROUND SETTINGS ---------------- */
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="font-bold text-slate-800 mb-4 flex text-xl items-center gap-2">
                                <FaRegImage className="text-slate-400   w-5 h-5" />
                                Background
                            </h2>

                            {/* Tabs */}
                            <div className="flex p-1 bg-slate-100 rounded-lg mb-4">
                                <button className="flex-1 py-1.5 text-xs font-medium rounded-md text-slate-500">
                                    Solid
                                </button>
                                <button className="flex-1 py-1.5 text-xs font-medium hover:text-slate-700 text-slate-500">
                                    Gradient
                                </button>
                                <button className="flex-1 py-1.5 text-xs font-medium hover:text-slate-700 bg-white shadow-sm text-slate-700">
                                    Image
                                </button>
                            </div>

                            {/* Solid Color Picker */}
                            <div className="space-y-3">
                                {/* Main Picker */}
                                {/* <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#1e3a8a] border-2 border-white shadow-md cursor-pointer ring-2 hover:ring-brand-200 transition-all" />
                                    <input
                                        type="text"
                                        defaultValue="#1E3A8A"
                                        className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-sm font-mono text-slate-600 uppercase"
                                    />
                                </div> */}

                                {/* Quick Colors */}
                                <div className="flex w-full justify-between">
                                    <div className=" w-full flex gap-2">
                                        {[
                                            "bg-slate-900",
                                            "bg-white",
                                            "bg-blue-600",
                                            "bg-purple-600",
                                            "bg-emerald-500",
                                        ].map((cls, idx) => (
                                            <button
                                                key={idx}
                                                className={`w-8 h-8 rounded-full border border-slate-200 ${cls}`}
                                            />
                                        ))}

                                        <button  onClick={() => setColorPicker(true)} className={`w-8 h-8 ${colorPickerValue && "hidden"} rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-200`}>
                                            <FaPlus  className="text-xs" />
                                        </button>

                                        {/* Add New Color */}

                                    </div>
                                    {
                                        colorPickerValue && 
                                        <ColorPicker/>
                                    }

                                </div>


                                {/* Noise Toggle */}
                                <div className="pt-3 border-t border-gray-100">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <div className="relative inline-block w-10 h-5">
                                            <input
                                                type="checkbox"
                                                className="toggle-checkbox absolute w-5 h-5 rounded-full bg-white border-4 cursor-pointer"
                                            />
                                            <span className="toggle-label block h-5 rounded-full bg-gray-300" />
                                        </div>
                                        <span className="text-xs font-medium text-slate-600">
                                            Add Noise Texture
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}
                </section>


                {/* 2. AI Content & Layout */}
                {/* <section
                    id="section-content"
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
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
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">AI Content Generator</h3>
                            <p className="text-xs text-slate-500">
                                Auto-generate your slide structure
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                                    Slide Title
                                </label>
                                <input
                                    type="text"
                                    defaultValue="5 Ways to Boost Productivity"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                                    Tone of Voice
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <button className="px-3 py-1.5 text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200 rounded-full">
                                        Professional
                                    </button>
                                    <button className="px-3 py-1.5 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-full hover:border-slate-300">
                                        Friendly
                                    </button>
                                    <button className="px-3 py-1.5 text-xs font-medium bg-white text-slate-600 border border-slate-200 rounded-full hover:border-slate-300">
                                        Energetic
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1.5">
                                    Layout Style
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        className="flex-1 h-10 border-2 border-brand-500 bg-brand-50 rounded-lg flex items-center justify-center text-brand-600"
                                        title="Left Align"
                                    >
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
                                    <button
                                        className="flex-1 h-10 border border-slate-200 bg-white rounded-lg flex items-center justify-center text-slate-400 hover:border-slate-300"
                                        title="Center Align"
                                    >
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
                                    <button
                                        className="flex-1 h-10 border border-slate-200 bg-white rounded-lg flex items-center justify-center text-slate-400 hover:border-slate-300"
                                        title="Right Align"
                                    >
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
                            <button className="w-full h-10 mt-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
                                <i data-fa-i2svg="">
                                    <svg
                                        className="svg-inline--fa fa-bolt"
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fas"
                                        data-icon="bolt"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 448 512"
                                        data-fa-i2svg=""
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"
                                        />
                                    </svg>
                                </i>{" "}
                                Generate Structure
                            </button>
                        </div>
                    </div>
                </section> */}
                {/* 3. Visual Styling (Background, Typography, Colors) */}
                <section
                    id="section-styling"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Background Settings */}

                    {/* Typography & Brand */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <i className="text-slate-400" data-fa-i2svg="">
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
                            </i>{" "}
                            Typography
                        </h3>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                                Font Family
                            </label>
                            <div className="relative">
                                <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none outline-none focus:border-brand-500">
                                    <option>Inter</option>
                                    <option>Roboto</option>
                                    <option>Poppins</option>
                                    <option>Playfair Display</option>
                                </select>
                                <i
                                    className="absolute right-3 top-3 text-xs text-slate-400 pointer-events-none"
                                    data-fa-i2svg=""
                                >
                                    <svg
                                        className="svg-inline--fa fa-chevron-down"
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fas"
                                        data-icon="chevron-down"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 512 512"
                                        data-fa-i2svg=""
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                                        />
                                    </svg>
                                </i>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                                    Title Size
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="range"
                                        min={16}
                                        max={72}
                                        defaultValue={48}
                                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                    />
                                    <span className="text-xs text-slate-600 w-6">48</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                                    Body Size
                                </label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="range"
                                        min={10}
                                        max={24}
                                        defaultValue={16}
                                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
                                    />
                                    <span className="text-xs text-slate-600 w-6">16</span>
                                </div>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                            <label className="block text-xs font-semibold text-slate-500 mb-2">
                                Accent Color
                            </label>
                            <div className="flex gap-2">
                                <button className="w-6 h-6 rounded bg-yellow-400 ring-2 ring-offset-1 ring-brand-200" />
                                <button className="w-6 h-6 rounded bg-pink-500" />
                                <button className="w-6 h-6 rounded bg-cyan-400" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            {/* Right: Live Preview Panel (Sticky) */}
            <div
                id="preview-panel"
                className=" xl:flex w-5/12 bg-slate-100 border-l border-gray-200 items-center justify-center relative"
            >
                {/* Background Pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
                        backgroundSize: "20px 20px"
                    }}
                />
                <div className="relative z-10 flex flex-col items-start">
                    <div className="mb-4 flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur rounded-full shadow-sm border border-gray-200">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs font-semibold text-slate-600">
                            Live Preview
                        </span>
                    </div>
                    {/* Device Mockup / Carousel Container */}
                    <div className="w-[380px] h-[475px] bg-white rounded-xl shadow-2xl overflow-hidden relative transform transition-all hover:scale-[1.02] duration-300 ring-1 ring-black/5">
                        {/* Slide Content (Simulated Result) */}
                        <div className="absolute inset-0 bg-[#1e3a8a] text-white p-8 flex flex-col justify-between">
                            {/* Slide Header */}
                            <div>
                                <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-medium mb-4">
                                    Step 1 of 5
                                </div>
                                <h2 className="text-3xl font-bold leading-tight mb-3">
                                    5 Ways to Boost Productivity
                                </h2>
                                <p className="text-sm text-white/80 leading-relaxed">
                                    Transform your workflow with proven strategies
                                </p>
                            </div>
                            {/* Slide Footer */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img
                                        src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg"
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full border-2 border-white/20"
                                    />
                                    <div>
                                        <p className="text-xs font-semibold">Alex Designer</p>
                                        <p className="text-[10px] text-white/60">@alexdesigner</p>
                                    </div>
                                </div>
                                <div className="text-yellow-400">
                                    <i className="text-2xl" data-fa-i2svg="">
                                        <svg
                                            className="svg-inline--fa fa-linkedin"
                                            aria-hidden="true"
                                            focusable="false"
                                            data-prefix="fab"
                                            data-icon="linkedin"
                                            role="img"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 448 512"
                                            data-fa-i2svg=""
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"
                                            />
                                        </svg>
                                    </i>
                                </div>
                            </div>
                            {/* Decorative Element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
                        </div>
                    </div>
                    {/* Preview Controls */}
                    <div className="mt-6 flex items-center gap-2">
                        <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                            <i className="text-xs" data-fa-i2svg="">
                                <svg
                                    className="svg-inline--fa fa-chevron-left"
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="chevron-left"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 320 512"
                                    data-fa-i2svg=""
                                >
                                    <path
                                        fill="currentColor"
                                        d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                                    />
                                </svg>
                            </i>
                        </button>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-brand-600" />
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                        </div>
                        <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors">
                            <i className="text-xs" data-fa-i2svg="">
                                <svg
                                    className="svg-inline--fa fa-chevron-right"
                                    aria-hidden="true"
                                    focusable="false"
                                    data-prefix="fas"
                                    data-icon="chevron-right"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 320 512"
                                    data-fa-i2svg=""
                                >
                                    <path
                                        fill="currentColor"
                                        d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                                    />
                                </svg>
                            </i>
                        </button>
                    </div>
                </div>
            </div>
        </div >

    )
}