import { useState } from "react";
import { faqs } from "./constants";
import { FaPlus } from "react-icons/fa";
import clsx from "clsx";

export default function FAQSections() {
    const [activeFaq, setActiveFaq] = useState('faq-1');
    return (
        <div  className="relative">
            <div className="absolute top-1/2 right-0 w-96 h-96 rounded-full bg-primary/20 filter blur-[150px]"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-4">
                        <p className="text-sm font-medium">FAQ</p>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
                    <p className="text-xl text-gray-300">Everything you need to know about AgentZee.ai</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-6">

                    {faqs.map((faq) => (
                        <div
                            key={faq.id}
                            id={faq.id}
                            className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg"
                        >
                            <button
                                onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                                className="flex justify-between items-center w-full text-left transition-all duration-300"
                            >
                                <h3 className="text-xl font-bold">{faq.question}</h3>
                                <FaPlus className={clsx("text-secondary", activeFaq === faq.id && 'rotate-45')} />
                            </button>
                            {activeFaq === faq.id && (
                                <div className="mt-4">
                                    <p className="text-gray-300">{faq.answer}</p>
                                </div>
                            )}

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
