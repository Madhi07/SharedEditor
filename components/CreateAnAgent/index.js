export default function CreateAnAgentCard({ data = {}, btnOnClick }) {
    return (
        <div id={data?.id} className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary/80 border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 shadow-lg group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-6 mx-auto">
                <data.icon className="fa-solid fa-plus text-white text-2xl" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-center">{data?.title}</h3>
            <p className="text-gray-400 text-center mb-6">{data?.description}</p>
            <button className="flex justify-center mx-auto" onClick={btnOnClick}>
                <span className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors px-6 py-2 rounded-full text-white font-medium cursor-pointer group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary">
                    Select
                </span>
            </button>
        </div>
    )
}
