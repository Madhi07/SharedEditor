import { AiOutlineInfo } from "react-icons/ai";
import { FaExclamationTriangle, FaInstagram, FaMobileAlt, FaRegThumbsUp, FaSlack } from "react-icons/fa";
import { FiFlag, FiGlobe, FiKey, FiServer, FiToggleRight, FiUnlock } from "react-icons/fi";
import { MdInfoOutline, MdSettings, MdShare } from "react-icons/md";

export const chatbotIntegrationInstructions = {
    facebook: [
        {
            "title": "You must have a Facebook page for your business",
            "requirements": [
                {
                    "icon": FiFlag,
                    "text": "You need to have a Facebook page for your business linked to your Facebook account.",
                    "link": {
                        "label": "Facebook page",
                        "url": "https://www.facebook.com/help/104002523024878"
                    }
                },
                {
                    "icon": FiToggleRight,
                    "text": "The next step will take you to Facebook authentication. Make sure you grant Agentzee Messenger's required access."
                }
            ],
            "help": {
                "icon": AiOutlineInfo,
                "text": "Need help? Check the full setup instructions.",
                "link": {
                    "label": "Detailed guide",
                    "url": "#"
                }
            },
        }
    ],
    discord: [
        {
            "title": "You must have a Discord server for your community or team",
            "requirements": [
                {
                    "icon": FiServer,
                    "text": "You need to have a Discord server where you have admin or manage server permissions.",
                    "link": {
                        "label": "Discord server",
                        "url": "#"
                    }
                },
                {
                    "icon": FiToggleRight,
                    "text": "The next step will take you to Discord authentication. Make sure you grant Agentzee Conversations permission to access your server and manage integrations."
                }
            ],
            "help": {
                "icon": AiOutlineInfo,
                "text": "Need help? Check the full setup instructions.",
                "link": {
                    "label": "Detailed guide",
                    "url": "#"
                }
            }
        }
    ],
    instagram: [
        {
            "title": "You must have an Instagram professional account",
            "requirements": [
                {
                    "icon": FaInstagram,
                    "text": "Only Instagram professional accounts can be connected to Conversations."
                },
                {
                    "icon": MdSettings,
                    "text": "Go to your account settings on Instagram to switch to professional account.",
                    "link": {
                        "label": "switch to professional account",
                        "url": "https://help.instagram.com/502981923235522"
                    }
                }
            ],
            "help": {
                "icon": AiOutlineInfo,
                "text": "Need help? Check the full setup instructions.",
                "link": {
                    "label": "Detailed guide",
                    "url": "#"
                }
            }
        },
        {
            "title": "Your Instagram account must be linked to a Facebook page",
            "requirements": [
                {
                    "icon": FiFlag,
                    "text": "You must have a Facebook page for your business, published and linked to your Facebook account.",
                    "link": {
                        "label": "Facebook page",
                        "url": "https://www.facebook.com/help/104002523024878"
                    }
                },
                {
                    "icon": MdSettings,
                    "text": "Your Instagram account must be linked to your Facebook page. Go to your page settings on Facebook to link your Instagram account.",
                    "link": {
                        "label": "link your Instagram account",
                        "url": "https://help.instagram.com/570895513091465"
                    }
                },
                {
                    "icon": FiToggleRight,
                    "text": "The next step will take you to Facebook authentication. Make sure you grant Agentzee Messenger's required access."
                }
            ],
            "help": {
                "icon": AiOutlineInfo,
                "text": "Need help? Check the full setup instructions.",
                "link": {
                    "label": "Detailed guide",
                    "url": "#"
                }
            }
        },

    ],
    whatsapp: [
        {
            "title": "You must have a valid and a dedicated phone number to use WhatsApp business API.",
            "requirements": [
                {
                    "icon": FiUnlock,
                    "text": "You will receive a verification code to authenticate your number on our platform."
                },
                {
                    "icon": FaMobileAlt,
                    "text": "The phone number for your business must be a valid phone number which meets the WhatsApp Business Platform criteria",
                    "link": {
                        "label": "WhatsApp Business Platform criteria",
                        "url": "#"
                    }
                },
                {
                    "icon": MdShare,
                    "text": "You need a phone number that has not been associated to another Business Service provider."
                },
                {
                    "icon": MdInfoOutline,
                    "text": "Creating multiple WhatsApp Business Accounts linked to a single Facebook account is not supported on Agentzee."
                },
            ]
        },
        {
            "title": "You must have a personal Facebook account (linked to your business email)",
            "requirements": [
                {
                    "icon": null,
                    "text": "To authenticate your business account, open this link on a separate tab.",
                    "link": {
                        "label": "this link",
                        "url": "https://www.facebook.com/security/twofactor/reauth/"
                    }
                },
                {
                    "icon": null,
                    "text": "You must now generate a code in your authentication app and enter it in the “Enter Code” field.",
                },
                {
                    "icon": null,
                    "text": "Once you confirm, you can close the tab."
                }
            ]
        },
        {
            "title": "Prepare your business details",
            "requirements": [
                {
                    "icon": FiGlobe,
                    "text": "You must have your business details at hand : your company's legal name and address, as well as your business account as you want to display it."
                },
                {
                    "icon": FaRegThumbsUp,
                    "text": "You must have a valid business website.",
                    "link": {
                        "label": "valid business",
                        "url": "#"
                    }
                },
                {
                    "icon": FaExclamationTriangle,
                    "text": "It is required that you verify your account with Meta as soon as possible. A verified business can start to send 1k messages /day. If you do not verify your account, Meta will disable your account."
                },
                {
                    "icon": FaExclamationTriangle,
                    "text": "As per Meta's policy, an unverified business account can only be linked to two numbers, Verify your account to link your account with more numbers."
                },
            ]
        },
    ],
    slack: [
        {
            "title": "You must have a Slack workspace",
            "requirements": [
                {
                    "icon": FaSlack,
                    "text": "Only Slack workspaces can be connected to Conversations."
                },
                {
                    "icon": MdSettings,
                    "text": "Go to your Slack workspace or create a new workspace if you don't already have one.",
                    "link": {
                        "label": "create a new workspace",
                        "url": "https://slack.com/create"
                    }
                }
            ],
            "help": {
                "icon": AiOutlineInfo,
                "text": "Need help? Check the full setup instructions.",
                "link": {
                    "label": "Detailed guide",
                    "url": "#"
                }
            }
        },
        {
            "title": "Grant access to Agentzee Conversations",
            "requirements": [
                {
                    "icon": FiKey,
                    "text": "You must have admin or owner permissions in your Slack workspace to install new apps.",
                    "link": {
                        "label": "permissions",
                        "url": "https://slack.com/help/articles/202035138-Manage-apps-for-your-workspace"
                    }
                },
                {
                    "icon": MdSettings,
                    "text": "Click the button below to connect your Slack workspace. You'll be redirected to Slack to approve required permissions for Agentzee Conversations."
                },
                {
                    "icon": FiToggleRight,
                    "text": "Make sure to grant full access to post messages, reply to users, and manage conversations on your behalf."
                }
            ],
            "help": {
                "icon": AiOutlineInfo,
                "text": "Need help? Check the full setup instructions.",
                "link": {
                    "label": "Detailed guide",
                    "url": "#"
                }
            }
        }
    ],

};

