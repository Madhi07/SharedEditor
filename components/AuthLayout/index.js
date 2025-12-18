import LeftCard from "./LeftCard";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-6">

            <div id="auth-container" className="w-full max-w-md md:max-w-5xl flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl">

                <div id="auth-brand" className="bg-gradient-to-r from-primary/30 to-secondary/30 p-8 md:w-1/2 flex flex-col justify-between md:pb-16">
                    <LeftCard />
                </div>

                <div id="auth-form" className="bg-dark-card-primary p-8 md:w-1/2">
                    {children}
                </div>

            </div>
        </div>
    )
}
