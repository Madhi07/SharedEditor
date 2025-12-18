// app/page.tsx
import Link from 'next/link';

export default function HubSpotIntegration() {
    const benefits = [
        {
            icon: '🤖',
            title: 'AI-Powered Search',
            description: 'Ask natural-language questions to retrieve HubSpot contacts and companies instantly.'
        },
        {
            icon: '🔍',
            title: 'Quick CRM Insights',
            description: 'Get fast access to your HubSpot contact and company details without switching tabs.'
        },
        {
            icon: '🔒',
            title: 'Secure User-Level Access',
            description: 'Uses OAuth 2.0 with read-only permissions to ensure your data stays safe.'
        },
        {
            icon: '⚡',
            title: 'Instant Connection',
            description: 'Connect HubSpot to AgentZee in just a few clicks—no setup required.'
        }
    ];

    const steps = [
        {
            number: 1,
            title: 'Go to AgentZee Website',
            content: 'Start by visiting the AgentZee platform:',
            items: [
                'Open your browser and navigate to https://app.agentzee.ai',
                'You will see the AgentZee homepage with login and signup options'
            ],
            screenshots: [
                { src: '/hubspot/landing-page.png', alt: 'AgentZee homepage with login and signup options' },
            ]
        },
        {
            number: 2,
            title: 'Create Account or Login',
            content: 'Access your AgentZee account to begin the integration:',
            items: [
                'New User: Click "Sign Up" and create your account',
                'Existing User: Click "Login" and enter your credentials',
                'Complete onboarding if you are a new user'
            ],
            highlight: {
                icon: '💡',
                title: 'Tip:',
                text: 'Verify your email for full access to integrations.'
            },
            screenshots: [
                { src: '/hubspot/login.png', alt: 'AgentZee login page' },
                { src: '/hubspot/signup.png', alt: 'AgentZee signup form' },
                { src: '/hubspot/verify.png', alt: 'Email verification screen' }
            ]
        },
        {
            number: 3,
            title: 'Navigate to Integrations',
            content: 'Open the integrations section from your dashboard:',
            items: [
                'Click on "Integrations" from the sidebar menu',
                'View available platforms including HubSpot'
            ],
            screenshots: [
                { src: '/hubspot/integrations.png', alt: 'Integrations list' }
            ]
        },
        {
            number: 4,
            title: 'Click "Connect to HubSpot"',
            content: 'Begin the HubSpot connection process:',
            items: [
                'Find the HubSpot integration card',
                'Click "Connect to HubSpot"',
                'You’ll be redirected to HubSpot’s authorization page'
            ],
            screenshots: [
                { src: '/hubspot/connect-hubspot.png', alt: 'HubSpot connection button' }
            ]
        },
        {
            number: 5,
            title: 'Authorize the Connection',
            content: 'Grant AgentZee permission to access your HubSpot data:',
            items: [
                'Review the permissions (Contacts read, Companies read)',
                'Select your HubSpot account',
                'Click "Connect App"'
            ],
            highlight: {
                icon: '🔒',
                title: 'Security Note:',
                text: 'AgentZee uses secure OAuth 2.0. Your HubSpot password is never shared.'
            },
            screenshots: [
                { src: '/hubspot/connected-hubspot.png', alt: 'HubSpot permission screen' },
            ]
        },
        {
            number: 6,
            title: 'Connection Successful',
            content: 'You are now connected!',
            items: [
                'Your AI agent can now read Contacts and Companies via HubSpot MCP',
                'No syncing or updating occurs—data is read-only',
                'Navigate to "Chats" to ask questions using your HubSpot data'
            ],
            success: true,
            successText: '✅ Success! AgentZee is now connected to HubSpot.',
            screenshots: [
                { src: '/hubspot/successfly-con.png', alt: 'Successful connection confirmation' }
            ]
        },
        {
            number: 7,
            title: 'Ask Questions & Retrieve CRM Data',
            content: 'Use the AI to pull information from HubSpot:',
            items: [
                'Ask: "Show me contacts created today"',
                'Ask: "List companies from India"',
                'Ask: "Find contacts with no recent activity"',
                'AI fetches answers using read-only access'
            ],
            screenshots: [
                { src: '/hubspot/chats-dashboard.png', alt: 'Chat question example' },
                { src: '/hubspot/response.png', alt: 'AI response example' },
            ]
        }
    ];

    const faqs = [
        {
            question: 'What HubSpot data does AgentZee access?',
            answer: 'AgentZee can read your HubSpot Contacts and Companies using MCP (read-only access).'
        },
        {
            question: 'Does AgentZee sync or update data in HubSpot?',
            answer: 'No. This integration is strictly read-only. AgentZee does not modify or write any data to HubSpot.'
        },
        {
            question: 'Are conversations or AI responses logged into HubSpot?',
            answer: 'No. AgentZee does not write activities, logs, or notes to HubSpot.'
        },
        {
            question: 'Is OAuth secure?',
            answer: 'Yes. AgentZee uses OAuth 2.0. Your HubSpot password is never shared with AgentZee.'
        },
        {
            question: 'Can I disconnect the integration?',
            answer: 'Yes, you can disconnect any time from the Integrations page.'
        }
    ];

    return (
        <div className="min-h-screen bg-white">

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
                <div className="max-w-5xl mx-auto px-6 py-20 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                        How to Connect AgentZee to HubSpot
                    </h1>
                    <p className="text-xl md:text-2xl opacity-95 max-w-3xl mx-auto">
                        Connect AgentZee to HubSpot to access your Contacts and Companies through AI.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 py-16">

                {/* Intro Section */}
                <div className="bg-gray-50 border-l-4 border-purple-600 rounded-xl p-10 mb-16">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Why Connect AgentZee with HubSpot?
                    </h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Integrating HubSpot with AgentZee lets your AI assistant read your Contact and Company information securely using HubSpot’s MCP server. This provides instant CRM insights through natural-language questions—without editing or syncing any data.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-white rounded-xl p-8 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
                            <div className="text-5xl mb-4">{benefit.icon}</div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">{benefit.title}</h3>
                            <p className="text-sm text-gray-600">{benefit.description}</p>
                        </div>
                    ))}
                </div>

                {/* Steps */}
                <div className="mb-16">
                    <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
                        Step-by-Step Integration Guide
                    </h2>

                    <div className="space-y-8">
                        {steps.map((step) => (
                            <div key={step.number} className="bg-white border-2 border-gray-200 rounded-xl p-10 hover:border-purple-600 hover:shadow-xl transition-all duration-300">
                                <div className="flex items-center mb-6">
                                    <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mr-6">
                                        {step.number}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800">{step.title}</h3>
                                </div>

                                <div className="md:pl-20">
                                    {step.success && (
                                        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 mb-6">
                                            <strong className="text-green-600 block mb-2">
                                                {step.successText}
                                            </strong>
                                        </div>
                                    )}

                                    <p className="text-gray-600 text-lg mb-4">{step.content}</p>

                                    <ul className="space-y-3">
                                        {step.items.map((item, idx) => (
                                            <li key={idx} className="text-gray-600 text-lg pl-8 relative">
                                                <span className="absolute left-0 text-purple-600 font-bold text-xl">→</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>

                                    {step.highlight && (
                                        <div className="bg-gray-100 border-l-4 border-purple-600 text-purple-600 rounded-lg p-6 mt-6">
                                            <strong className="block mb-2">{step.highlight.icon} {step.highlight.title}</strong>
                                            {step.highlight.text}
                                        </div>
                                    )}

                                    {step.screenshots?.length > 0 && (
                                        <div className="mt-6 space-y-6">
                                            {step.screenshots.map((screenshot, idx) => (
                                                <div key={idx}>
                                                    <img src={screenshot.src} alt={screenshot.alt} className="w-full rounded-lg shadow-lg border border-gray-200" />
                                                    <p className="text-center text-sm text-gray-500 italic mt-2">{screenshot.alt}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-gray-50 rounded-xl p-10 md:p-16 mb-16">
                    <h2 className="text-4xl font-bold text-gray-800 text-center mb-10">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md">
                                <h3 className="text-xl font-semibold text-purple-600 mb-3">{faq.question}</h3>
                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Support */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white rounded-xl p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Need Help with Integration?</h2>
                    <p className="text-xl mb-8 opacity-95">
                        Our support team is here to help you connect AgentZee and HubSpot.
                    </p>
                    <a href="mailto:support@agentzee.ai" className="inline-block px-8 py-4 bg-white text-purple-600 rounded-lg font-semibold text-lg hover:-translate-y-1 hover:shadow-xl transition-all">
                        📧 Email Support
                    </a>
                    <p className="mt-8 text-sm opacity-90">Available Monday - Friday, 9 AM - 6 PM IST</p>
                </div>
            </div>

            <footer className="border-t border-gray-200 mt-16 py-12 text-center text-gray-600">
                <p className="mb-4">&copy; 2025 AgentZee. All rights reserved.</p>
                <div className="flex flex-wrap justify-center gap-6">
                    <Link href="https://app.agentzee.ai/" className="text-purple-600 hover:underline">Home</Link>
                    <Link href="https://app.agentzee.ai/privacy-policy" className="text-purple-600 hover:underline">Privacy Policy</Link>
                    <Link href="https://app.agentzee.ai/terms-of-service" className="text-purple-600 hover:underline">Terms of Service</Link>
                    <a href="mailto:support@agentzee.ai" className="text-purple-600 hover:underline">Contact</a>
                </div>
            </footer>
        </div>
    );
}
