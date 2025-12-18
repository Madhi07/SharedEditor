export default function CaptionThemeSelector({ selected, onSelect }) {
    const themes = [
        { name: "BASIC", class: "basic-style" },
        { name: "REVID", class: "revid-style" },
        { name: "HORMOZI", class: "hormozi-style" },

        { name: "Ali", class: "ali-style" },
        { name: "Wrap 1", class: "wrap1-style" },
        { name: "WRAP 2", class: "wrap2-style" },

        { name: "FACELESS", class: "faceless-style" },
        { name: "Elegant", class: "elegant-style" },
        { name: "Difference", class: "difference-style" },

        { name: "Opacity", class: "opacity-style" },
        { name: "Playful", class: "playful-style" },
        { name: "Cove", class: "cove-style" },

        { name: "Movie", class: "movie-style" },
        { name: "Outline", class: "outline-style" },
    ];

    return (
        <div className="w-full">
           
            <div className="grid grid-cols-3 gap-4">
                {themes.map((t) => (
                    <button
                        key={t.name}
                        onClick={() => onSelect(t.name)}
                        className={`caption-box 
              ${selected === t.name ? "selected-box" : ""}
            `}
                    >
                        <span className={t.class}>{t.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
