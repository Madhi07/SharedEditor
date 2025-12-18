import MainLayout from "@/components/MainLayout";
import { seoData } from "@/constants/seoData";
import { NextSeo } from "next-seo";
import { Fragment } from "react";
import { FaBan, FaChartLine, FaCheckCircle, FaCogs, FaDatabase, FaDownload, FaEdit, FaEye, FaInfoCircle, FaLock, FaPause, FaServer, FaServicestack, FaTrash, FaUserCheck, FaUserCog, FaUserShield } from "react-icons/fa";
import { FaShareNodes, FaShieldHalved } from "react-icons/fa6";
import { LuFileCheck } from "react-icons/lu";

export default function PrivacyPolicyPage() {
    return (
        <Fragment>
            <NextSeo {...seoData.privacyPolicyPage} />
            <MainLayout>
                <section id="privacy-policy" className="md:py-40 py-24 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-bg-secondary to-dark-bg-primary z-0"></div>

                    <div className="relative">
                        <div className="absolute top-0 right-10 w-80 h-80 rounded-full bg-primary/20 filter blur-[100px] animate-pulse-slow"></div>
                        <div className="absolute top-0 left-10 w-80 h-80 rounded-full bg-secondary/20 filter blur-[100px] animate-pulse-slow"></div>
                        <div className="container mx-auto px-4 md:px-8 relative z-10 mb-16">
                            <div className="text-center max-w-4xl mx-auto">
                                <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-6">
                                    <p className="text-sm font-medium flex items-center justify-center">
                                        <FaShieldHalved className=" text-primary mr-2" />
                                        Legal Information
                                    </p>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                                    Privacy <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Policy</span>
                                </h1>

                                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                                    Your privacy is important to us. This policy explains how AgentZee.ai collects, uses, and protects your personal information.
                                </p>

                                <div className="text-sm text-gray-400">
                                    <p>Last updated: June 2025</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 md:px-8 relative z-10">
                        <div className="max-w-4xl mx-auto">

                            <div id="privacy-intro" className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 mb-8">
                                <h2 className="text-3xl font-bold mb-6 flex items-center">
                                    <FaInfoCircle className=" text-primary mr-3" />
                                    Introduction
                                </h2>
                                <p className="text-gray-300 mb-4">
                                    AgentZee.ai ("we," "our," or "us") is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                                </p>
                                <p className="text-gray-300">
                                    By using our services, you agree to the collection and use of information in accordance with this policy.
                                </p>
                            </div>


                            <div id="privacy-collect" className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 mb-8">
                                <h2 className="text-3xl font-bold mb-6 flex items-center">
                                    <FaDatabase className="text-primary mr-3" />
                                    Information We Collect
                                </h2>

                                <div className="space-y-6">
                                    <div className="border-l-4 border-primary pl-6">
                                        <h3 className="text-xl font-semibold mb-3 text-white">Personal Information</h3>
                                        <p className="text-gray-300">
                                            We may collect personal information that you provide directly to us, including:
                                        </p>
                                        <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                                            <li>Name and contact information</li>
                                            <li>Email address and phone number</li>
                                            <li>Company information</li>
                                            <li>Payment and billing information</li>
                                            <li>Account credentials</li>
                                        </ul>
                                    </div>

                                    <div className="border-l-4 border-secondary pl-6">
                                        <h3 className="text-xl font-semibold mb-3 text-white">Usage Information</h3>
                                        <p className="text-gray-300">
                                            We automatically collect information about how you use our services:
                                        </p>
                                        <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
                                            <li>Device information and IP address</li>
                                            <li>Browser type and version</li>
                                            <li>Usage patterns and preferences</li>
                                            <li>Log data and analytics</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>


                            <div id="privacy-use" className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 mb-8">
                                <h2 className="text-3xl font-bold mb-6 flex items-center">
                                    <FaCogs className="text-primary mr-3" />
                                    How We Use Your Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white/5 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                                            <FaUserCog className=" text-primary mr-2" />
                                            Service Provision
                                        </h3>
                                        <ul className="text-gray-300 space-y-2 list-disc list-inside">
                                            <li>Provide and maintain our services</li>
                                            <li>Process transactions and payments</li>
                                            <li>Customize user experience</li>
                                            <li>Provide customer support</li>
                                        </ul>
                                    </div>

                                    <div className="bg-white/5 rounded-xl p-6">
                                        <h3 className="text-lg font-semibold mb-3 flex items-center">
                                            <FaChartLine className="text-secondary mr-2" />
                                            Improvement & Analytics
                                        </h3>
                                        <ul className="text-gray-300 space-y-2 list-disc list-inside">
                                            <li>Analyze usage patterns</li>
                                            <li>Improve our services</li>
                                            <li>Develop new features</li>
                                            <li>Ensure security and compliance</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>


                            <div id="privacy-sharing" className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 mb-8">
                                <h2 className="text-3xl font-bold mb-6 flex items-center">
                                    <FaShareNodes className="text-primary mr-3" />
                                    Information Sharing
                                </h2>

                                <p className="text-gray-300 mb-6">
                                    We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <FaCheckCircle className="text-green-400 mt-1 mr-3" />
                                        <div>
                                            <h4 className="font-semibold text-white">Service Providers</h4>
                                            <p className="text-gray-300">Trusted third parties who assist in operating our services</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <FaCheckCircle className="text-green-400 mt-1 mr-3" />
                                        <div>
                                            <h4 className="font-semibold text-white">Legal Requirements</h4>
                                            <p className="text-gray-300">When required by law or to protect our rights</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <FaCheckCircle className="text-green-400 mt-1 mr-3" />
                                        <div>
                                            <h4 className="font-semibold text-white">Business Transfers</h4>
                                            <p className="text-gray-300">In connection with mergers or acquisitions</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 mb-8">
                                <h2 className="text-3xl font-bold mb-6 flex items-center">
                                    <LuFileCheck className="text-primary mr-3" />
                                    Legal Compliance
                                </h2>

                                <p className="text-gray-300 mb-6">
                                    We ensure full compliance with global data protection regulations, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA), to safeguard user privacy and maintain transparency in our data handling practices.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <FaCheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-white">Legal Compliance Requirements</h4>
                                            <p className="text-gray-300">
                                                We respond only to government requests that are supported by valid legal processes, such as court orders, warrants, or subpoenas. Any request that lacks an appropriate legal basis is declined.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <FaCheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-white">User Notification Protocol</h4>
                                            <p className="text-gray-300">
                                                Where permitted by law, we inform users of any government requests related to their data. If legal restrictions prevent notification, we maintain internal records of such requests for accountability and auditing purposes.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <FaCheckCircle className="text-green-400 mt-1 mr-3 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-white">Transparency Commitment</h4>
                                            <p className="text-gray-300">
                                                e are committed to publishing regular transparency reports that provide details and statistics on the number and nature of government requests received and complied with, in accordance with industry best practices.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div id="privacy-security" className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 mb-8">
                                <h2 className="text-3xl font-bold mb-6 flex items-center">
                                    <FaShieldHalved className="text-primary mr-3" />
                                    Data Security
                                </h2>

                                <p className="text-gray-300 mb-6">
                                    We implement appropriate technical and organizational measures to protect your personal information:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                                            <FaLock className="text-white text-2xl" />
                                        </div>
                                        <h4 className="font-semibold mb-2">Encryption</h4>
                                        <p className="text-gray-300 text-sm">End-to-end encryption for data in transit and at rest</p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                                            <FaServer className="text-white text-2xl" />
                                        </div>
                                        <h4 className="font-semibold mb-2">Secure Infrastructure</h4>
                                        <p className="text-gray-300 text-sm">Industry-standard security protocols and monitoring</p>
                                    </div>

                                    <div className="text-center">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                                            <FaUserShield className="text-white text-2xl" />
                                        </div>
                                        <h4 className="font-semibold mb-2">Access Control</h4>
                                        <p className="text-gray-300 text-sm">Strict access controls and regular security audits</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 mb-8">
                                <h2 className="text-3xl font-bold mb-6 flex items-center">
                                    <FaServicestack className="text-primary mr-3" />
                                    Service Providers
                                </h2>

                                <p className="text-gray-300 mb-6">
                                    We may employ third-party companies and individuals to facilitate our Service (<span className="font-[600]">“Service Providers”</span>), provide Service on our behalf, perform Service-related services or assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
                                </p>

                                <ul className="list-disc ml-10 space-y-2">
                                    <li className="my-4 space-y-2">
                                        <p>
                                            <span className=" font-[700]"> Analytics</span> We may use third-party Service
                                            Providers to monitor and analyze the use of our Service.
                                        </p>
                                        <p>
                                            <span className=" font-[700]"> Google Analytics </span>Google Analytics is a
                                            web analytics service offered by Google that tracks and reports website
                                            traffic. Google uses the data collected to track and monitor the use of
                                            our Service. This data is shared with other Google services. Google may
                                            use the collected data to contextualize and personalize the ads of its own
                                            advertising network. For more information on the privacy practices of
                                            Google, please visit the Google Privacy Terms web page:
                                        </p>
                                        <p className="break-words">
                                            https://policies.google.com/privacy?hl=en We also encourage you to review
                                            Google's policy for safeguarding your data:
                                        </p>
                                        <p className="break-words ">
                                            https://support.google.com/analytics/answer/6004245.
                                        </p>
                                    </li>
                                    <li className="my-4">
                                        <p>
                                            <span className=" font-[700]">CI/CD tools</span> We may use third-party
                                            Service Providers to automate the development process of our Service.
                                        </p>
                                        <p className="break-words">
                                            <span className=" font-[700]">GitHub GitHub</span> is provided by GitHub,
                                            Inc. GitHub is a development platform to host and review code, manage
                                            projects, and build software. For more information on what data GitHub
                                            collects for what purpose and how the protection of the data is ensured,
                                            please visit GitHub Privacy Policy page:
                                            https://help.github.com/en/articles/github-privacy-statement.
                                        </p>
                                    </li>
                                    <li className="my-4">
                                        <p>
                                            <span className=" font-[700]">Payments</span> We may provide paid products
                                            and/or services within Service. In that case, we use third-party services
                                            for payment processing (e.g. payment processors). We will not store or
                                            collect your payment card details. That information is provided directly
                                            to our third-party payment processors whose use of your personal
                                            information is governed by their Privacy Policy. These payment processors
                                            adhere to the standards set by PCI-DSS as managed by the PCI Security
                                            Standards Council, which is a joint effort of brands like Visa,
                                            Mastercard, American Express and Discover. PCI-DSS requirements help
                                            ensure the secure handling of payment information.
                                        </p>
                                        <p className="mt-4">
                                            <span className=" font-[700]">The payment processors we work with are:</span>
                                        </p>
                                        <p className="mt-2">
                                            <span className=" font-[700] ">Stripe:</span> Their Privacy Policy can be
                                            viewed at https://stripe.com/us/privacy.
                                        </p>
                                        <p className="mt-2">
                                            <span className=" font-[700] "> Paypal:</span> Their Privacy Policy can be
                                            viewed at https://www.paypal.com/us/legalhub/privacy-full.
                                        </p>
                                        <p className="mt-2">
                                            <span className=" font-[700] "> Razorpay:</span> Their Privacy Policy can be
                                            viewed at https://razorpay.com/privacy/.
                                        </p>
                                    </li>
                                    <li className="my-4">
                                        <p>
                                            <span className=" font-[700]">Facebook & Instagram</span> Our platform does not retain any user data after disconnection. When a user disconnects, all access tokens, including page and Instagram tokens, are permanently deleted, and no other information is stored. The disconnection automatically triggers the data deletion process. We comply with Meta's privacy policy standards and follow their data protection and security requirements to ensure all active user data is securely managed and remains in full compliance with applicable regulations. User data is retained only for as long as needed to operate the chatbot or as required by law.
                                        </p>
                                        <p className="mt-4">
                                            <span className=" font-[700]">For more information, users can review Meta's privacy policies:</span>
                                        </p>
                                        <p className="mt-2">
                                            <span className=" font-[700] ">Facebook Privacy Policy:</span> Their Privacy Policy can be
                                            viewed at https://www.facebook.com/privacy/policy.
                                        </p>
                                        <p className="mt-2">
                                            <span className=" font-[700] "> Instagram Privacy Policy:</span> Their Privacy Policy can be
                                            viewed at https://privacycenter.instagram.com/policy.
                                        </p>
                                    </li>
                                </ul>
                            </div>


                            <div id="privacy-rights" className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8 mb-8">
                                <h2 className="text-3xl font-bold mb-6 flex items-center">
                                    <FaUserCheck className="text-primary mr-3" />
                                    Your Rights
                                </h2>

                                <p className="text-gray-300 mb-6">
                                    Depending on your location, you may have the following rights regarding your personal information:
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <FaEye className="text-primary mr-3" />
                                        <span className="text-gray-300">Right to access your data</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaEdit className=" text-primary mr-3" />
                                        <span className="text-gray-300">Right to correct inaccuracies</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaTrash className=" text-primary mr-3" />
                                        <span className="text-gray-300">Right to delete your data</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaDownload className="text-primary mr-3" />
                                        <span className="text-gray-300">Right to data portability</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaBan className=" text-primary mr-3" />
                                        <span className="text-gray-300">Right to object to processing</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaPause className="text-primary mr-3" />
                                        <span className="text-gray-300">Right to restrict processing</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


                </section>
            </MainLayout>
        </Fragment>
    )
}
