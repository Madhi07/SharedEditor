import Link from "next/link";
import { Fragment } from "react";
import { FaBuilding, FaCalendarAlt, FaCertificate, FaCheckCircle, FaDatabase, FaDownload, FaEyeSlash, FaGlobe, FaLock, FaServer, FaShieldAlt, FaUserShield } from "react-icons/fa";

export default function EnterpriseSecurity() {
    return (
        <Fragment>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mb-6">
                        <FaLock className=" text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">256-bit Encryption</h3>
                    <p className="text-gray-300">Military-grade AES-256 encryption protects all data in transit and at rest.</p>
                </div>

                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-6">
                        <FaCertificate className=" text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">GDPR Compliant</h3>
                    <p className="text-gray-300">Full compliance with European privacy regulations and data protection laws.</p>
                </div>

                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mb-6">
                        <FaServer className=" text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">SOC 2 Type II</h3>
                    <p className="text-gray-300">Independently audited security controls for enterprise-grade protection.</p>
                </div>

                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center mb-6">
                        <FaUserShield className=" text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Zero Trust Architecture</h3>
                    <p className="text-gray-300">Never trust, always verify approach with continuous authentication.</p>
                </div>

                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center mb-6">
                        <FaDatabase className=" text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Data Residency</h3>
                    <p className="text-gray-300">Choose where your data is stored with regional data centers worldwide.</p>
                </div>

                <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 flex items-center justify-center mb-6">
                        <FaEyeSlash className=" text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold mb-4">Privacy by Design</h3>
                    <p className="text-gray-300">Built-in privacy controls with minimal data collection principles.</p>
                </div>
            </div>

            <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-8">Trusted by Global Standards</h2>
                <div className="flex flex-wrap justify-center items-center gap-8">
                    <div className="flex items-center space-x-3">
                        <FaShieldAlt className=" text-green-400 text-2xl" />
                        <span className="text-lg font-medium">ISO 27001</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <FaCheckCircle className=" text-blue-400 text-2xl" />
                        <span className="text-lg font-medium">HIPAA</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <FaGlobe className=" text-purple-400 text-2xl" />
                        <span className="text-lg font-medium">CCPA</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        <FaBuilding className=" text-yellow-400 text-2xl" />
                        <span className="text-lg font-medium">PCI DSS</span>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <div className="bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl p-8 md:p-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise-Ready Security</h2>
                    <p className="text-xl text-gray-300 mb-8">Protect your business with bank-level security standards</p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Link
                            href={"/sign-up"}
                            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity px-8 py-3 rounded-full text-white font-medium text-center cursor-pointer"
                        >
                            Try Now
                        </Link>
                        <Link
                            href={"https://calendar.app.google/QSrGLwnkApJ6uxHu7"}
                            target="_blank"
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
