import { AgentZeeHead } from '@/components/SVG'
import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'
import { FaCalendar, FaCalendarAlt, FaChartLine, FaClock, FaCogs, FaComments, FaEye, FaHeart, FaLanguage, FaLightbulb, FaMicrophone, FaShieldAlt } from 'react-icons/fa'

export default function AdvancedAIIntelligence() {
    return (
        <Fragment>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

                <div className="relative">
                    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-float">
                        <Image
                            quality={100}
                            width={1024}
                            height={1024}
                            className="w-full h-full object-cover"
                            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/48eed10db2-5771ca84b65e8bb7dc90.png"
                            alt="futuristic AI brain visualization, neural networks, glowing connections, purple and pink gradients, dark background, holographic interface, advanced technology"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg-secondary via-transparent to-transparent"></div>


                        <div className='absolute top-4 flex gap-2 justify-between left-4 right-4 md:flex-row flex-col'>
                            <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10 w-max">
                                <div className="flex items-center mb-2">
                                    <FaChartLine className="fa-solid fa-chart-line text-green-400 mr-2" />
                                    <span className="text-sm font-medium">Context Understanding</span>
                                </div>
                                <div className="text-2xl font-bold text-green-400">98.7%</div>
                            </div>

                            <div className="bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10 w-max">
                                <div className="flex items-center mb-2">
                                    <FaHeart className="text-secondary mr-2" />
                                    <span className="text-sm font-medium">Emotion Detection</span>
                                </div>
                                <div className="text-2xl font-bold text-secondary">95.2%</div>
                            </div>
                        </div>

                        <div className="absolute bottom-6 left-6 right-6 bg-black/40 backdrop-blur-md rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium mb-1">Neural Processing Active</p>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                                        <span className="text-xs text-gray-300">Real-time analysis running</span>
                                    </div>
                                </div>
                                <div className="flex space-x-1">
                                    <div className="w-1 h-6 bg-primary/60 rounded animate-pulse"></div>
                                    <div className="w-1 h-8 bg-primary rounded animate-pulse [animation-delay:0.2s]"></div>
                                    <div className="w-1 h-4 bg-primary/80 rounded animate-pulse [animation-delay:0.4s]"></div>
                                    <div className="w-1 h-7 bg-primary rounded animate-pulse [animation-delay:0.6s]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-4">
                                <FaComments className=" text-white size-5" />
                            </div>
                            <h3 className="text-2xl font-bold">Natural Language Processing</h3>
                        </div>
                        <p className="text-gray-300">Advanced NLP algorithms understand nuanced language, context, and conversational flow to provide human-like responses.</p>
                    </div>

                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-4">
                                <FaHeart className=" text-white" />
                            </div>
                            <h3 className="text-2xl font-bold">Emotion Recognition</h3>
                        </div>
                        <p className="text-gray-300">Real-time sentiment analysis detects emotional states and adjusts responses accordingly for empathetic interactions.</p>
                    </div>

                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center mr-4">
                                <FaLightbulb className=" text-white" />
                            </div>
                            <h3 className="text-2xl font-bold">Intent Understanding</h3>
                        </div>
                        <p className="text-gray-300">Multi-layered intent recognition ensures agents understand what users really want, even with ambiguous requests.</p>
                    </div>
                </div>
            </div>


            <div className="mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Technical Capabilities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                            <FaLanguage className=" text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">30+ Languages</h3>
                        <p className="text-gray-400 text-sm">Multi-language support with cultural context awareness</p>
                    </div>

                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                            <FaClock className=" text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Real-time</h3>
                        <p className="text-gray-400 text-sm">Sub-second response times with continuous learning</p>
                    </div>

                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                            <FaShieldAlt className=" text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Privacy First</h3>
                        <p className="text-gray-400 text-sm">On-device processing with encrypted data handling</p>
                    </div>

                    <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-xl p-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                            <FaCogs className=" text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">Adaptive</h3>
                        <p className="text-gray-400 text-sm">Self-improving algorithms that learn from interactions</p>
                    </div>
                </div>
            </div>


            <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 md:p-12 mb-20">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powered by Multiple AI Models</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
                            <AgentZeeHead className=" text-white size-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Large Language Models</h3>
                        <p className="text-gray-300">GPT-4 and custom-trained models for sophisticated dialogue generation</p>
                    </div>

                    <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mx-auto mb-4">
                            <FaEye className=" text-white text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Computer Vision</h3>
                        <p className="text-gray-300">Advanced visual recognition for gesture and facial expression analysis</p>
                    </div>

                    <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                            <FaMicrophone className=" text-white text-3xl" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Speech Processing</h3>
                        <p className="text-gray-300">Real-time speech-to-text and text-to-speech with emotion synthesis</p>
                    </div>
                </div>
            </div>


            <div className="text-center">
                <div className="bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl p-8 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience the Future of AI</h2>
                    <p className="text-xl text-gray-300 mb-8">See how our advanced AI intelligence can transform your customer interactions</p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            href={'/sign-up'}
                            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 py-3 rounded-full text-white font-medium text-center cursor-pointer"
                        >
                            Try Live Demo
                        </Link>
                        <Link
                            href={"https://calendar.app.google/QSrGLwnkApJ6uxHu7"}
                            target='_blank'
                            rel="noopener"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-colors px-8 py-3 rounded-full text-white font-medium flex items-center justify-center cursor-pointer"
                        >
                            <FaCalendarAlt className=" mr-2" /> Schedule Demo
                        </Link>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
