import { FaPerson } from "react-icons/fa6";
import { MdAccessibility, MdAirlineSeatReclineExtra, MdRecordVoiceOver } from "react-icons/md";

export const urlRegExp = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
export const sitemapUrlRegExp = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?\.xml$/i;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const widgetDisabledPaths = ['/features', '/dashboard', '/try-now', "/login", "/sign-up"];
export const offerPopupDisabledPaths = ['/login', '/sign-up', "/"];

export const animationsToggles = [
    {
        text: "A Pose",
        name: "A-Pose",
        icon: MdAccessibility
    },
    {
        text: "Standing",
        name: "standing",
        icon: FaPerson
    },
    {
        text: "Relaxing",
        name: "relaxing",
        icon: MdAirlineSeatReclineExtra
    },
    {
        text: "Talking",
        name: "talking",
        icon: MdRecordVoiceOver
    },
];

export const LANGUAGE_CODES = [
    {
        "language": "english",
        "prominent_code": "en-US",
        "language_only_code": "en"
    },
    {
        "language": "spanish",
        "prominent_code": "es-ES",
        "language_only_code": "es"
    },
    {
        "language": "french",
        "prominent_code": "fr-FR",
        "language_only_code": "fr"
    },
    {
        "language": "german",
        "prominent_code": "de-DE",
        "language_only_code": "de"
    },
    {
        "language": "italian",
        "prominent_code": "it-IT",
        "language_only_code": "it"
    },
    {
        "language": "portuguese",
        "prominent_code": "pt-BR",
        "language_only_code": "pt"
    },
    {
        "language": "russian",
        "prominent_code": "ru-RU",
        "language_only_code": "ru"
    },
    {
        "language": "chinese",
        "prominent_code": "zh-CN",
        "language_only_code": "zh"
    },
    {
        "language": "japanese",
        "prominent_code": "ja-JP",
        "language_only_code": "ja"
    },
    {
        "language": "korean",
        "prominent_code": "ko-KR",
        "language_only_code": "ko"
    },
    {
        "language": "arabic",
        "prominent_code": "ar-XA",
        "language_only_code": "ar"
    },
    {
        "language": "hindi",
        "prominent_code": "hi-IN",
        "language_only_code": "hi"
    },
    {
        "language": "dutch",
        "prominent_code": "nl-NL",
        "language_only_code": "nl"
    },
    {
        "language": "swedish",
        "prominent_code": "sv-SE",
        "language_only_code": "sv"
    },
    {
        "language": "norwegian",
        "prominent_code": "nb-NO",
        "language_only_code": "no"
    },
    {
        "language": "danish",
        "prominent_code": "da-DK",
        "language_only_code": "da"
    },
    {
        "language": "finnish",
        "prominent_code": "fi-FI",
        "language_only_code": "fi"
    },
    {
        "language": "polish",
        "prominent_code": "pl-PL",
        "language_only_code": "pl"
    },
    {
        "language": "czech",
        "prominent_code": "cs-CZ",
        "language_only_code": "cs"
    },
    {
        "language": "hungarian",
        "prominent_code": "hu-HU",
        "language_only_code": "hu"
    },
    {
        "language": "greek",
        "prominent_code": "el-GR",
        "language_only_code": "el"
    },
    {
        "language": "hebrew",
        "prominent_code": "he-IL",
        "language_only_code": "he"
    },
    {
        "language": "thai",
        "prominent_code": "th-TH",
        "language_only_code": "th"
    },
    {
        "language": "vietnamese",
        "prominent_code": "vi-VN",
        "language_only_code": "vi"
    },
    {
        "language": "indonesian",
        "prominent_code": "id-ID",
        "language_only_code": "id"
    },
    {
        "language": "malay",
        "prominent_code": "ms-MY",
        "language_only_code": "ms"
    },
    {
        "language": "turkish",
        "prominent_code": "tr-TR",
        "language_only_code": "tr"
    },
    {
        "language": "romanian",
        "prominent_code": "ro-RO",
        "language_only_code": "ro"
    },
    {
        "language": "bulgarian",
        "prominent_code": "bg-BG",
        "language_only_code": "bg"
    },
    {
        "language": "croatian",
        "prominent_code": "hr-HR",
        "language_only_code": "hr"
    },
    {
        "language": "slovak",
        "prominent_code": "sk-SK",
        "language_only_code": "sk"
    },
    {
        "language": "slovenian",
        "prominent_code": "sl-SI",
        "language_only_code": "sl"
    },
    {
        "language": "estonian",
        "prominent_code": "et-EE",
        "language_only_code": "et"
    },
    {
        "language": "latvian",
        "prominent_code": "lv-LV",
        "language_only_code": "lv"
    },
    {
        "language": "lithuanian",
        "prominent_code": "lt-LT",
        "language_only_code": "lt"
    },
    {
        "language": "ukrainian",
        "prominent_code": "uk-UA",
        "language_only_code": "uk"
    },
    {
        "language": "tamil",
        "prominent_code": "ta-IN",
        "language_only_code": "ta"
    },
    {
        "language": "telugu",
        "prominent_code": "te-IN",
        "language_only_code": "te"
    },
    {
        "language": "marathi",
        "prominent_code": "mr-IN",
        "language_only_code": "mr"
    },
    {
        "language": "kannada",
        "prominent_code": "kn-IN",
        "language_only_code": "kn"
    },
    {
        "language": "malayalam",
        "prominent_code": "ml-IN",
        "language_only_code": "ml"
    },
    {
        "language": "bengali",
        "prominent_code": "bn-IN",
        "language_only_code": "bn"
    },
    {
        "language": "gujarati",
        "prominent_code": "gu-IN",
        "language_only_code": "gu"
    }
];

export const userInfoKeys = {
    "first_name": "",
    "last_name": "",

    "username": "", //email
    "user_id": "", //user id
    "uiux": "", // edit ui ux id
    "ui-ux-client_reference_id": "", //ui ux client (page id)
    "role": "", //user role
    "token": "", // user token
    "profile_image": "", // user profile image
    "plan": "free",  // user plan,
    "email": "",  //user email
    "country": "", // user country
    "EditPath": "", //  

    "plan_end_date": "", //user plan end data
    "total_ui_test": "", // user take total ui test
    "total_seo_test": "",  // user taken total seo tests
    "encrypted": false,

    "grammar": null,
    "ai_recommendation": null,
    "ai_chatbot_calls": null,
    "seo": null,

}

export const encryptedkeys = ['user_id', 'plan', 'country', 'role', 'username', 'email', 'plan_end_date']
