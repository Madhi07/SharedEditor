import { FaArrowRight } from "react-icons/fa";
import { features } from "../constants";
import Link from "next/link";

export default function FeaturesSection() {
    return (
        <section id="features" className="py-20 relative">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/20 filter blur-[150px]"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-4">
                        <p className="text-sm font-medium">Powerful Features</p>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Revolutionize Your Customer Experience</h2>
                    <p className="text-xl text-gray-300">Create intelligent 3D AI agents that understand, learn, and evolve with your business needs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature) => (
                        <Link
                            href={feature.link}
                            key={feature.id}
                            id={feature.id}
                            className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center mb-6">
                                <feature.icon className="text-white text-2xl" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-gray-300 mb-6">{feature.description}</p>
                            <span
                                className="inline-flex items-center text-primary group-hover:text-secondary transition-colors cursor-pointer"
                            >
                                Learn more <FaArrowRight className=" ml-2" />
                            </span>
                        </Link>
                    ))}

                </div>
            </div>
        </section>
    )
}
