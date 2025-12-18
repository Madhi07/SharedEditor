import { LANGUAGE_CODES } from "@/constants";

export default function LanguageSelector({ selectedLanguage, setSelectedLanguage, }) {
    return (
        <select
            onChange={(e) => setSelectedLanguage(JSON.parse(e.target.value))}
            value={JSON.stringify(selectedLanguage)}
            className="p-2.5 bg-dark-card-primary border border-dark-border-primary rounded-lg capitalize cursor-pointer outline-none focus:ring-2 focus:ring-secondary"
        >
            {LANGUAGE_CODES.map((lang, index) => (
                <option
                    key={index}
                    value={JSON.stringify(lang)}
                    className="capitalize"
                >
                    {lang.language}
                </option>
            ))}
        </select>
    )
}
