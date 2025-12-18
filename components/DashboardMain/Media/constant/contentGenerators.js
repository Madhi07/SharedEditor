// contentGenerators.config.js

export const contentGeneratorsConfig = {
    reels: {
        // UI Controls
        showDescription: true,
        showSlides: true,
        showPlatforms: true,

        // Text Labels
        title: "Select Platforms to Generate Video",
        subtitle: "Choose the platforms you want your video formatted for",
        descriptionLabel: "Video Description",

        // Placeholders
        placeholders: {
            description: "Enter your video description...",
            slides: "Enter number of slides"
        },

        // Actual Form Values
        form: {
            description: "",
            slides: 4,
            platform: null
        }
    },

    carousel: {
        // UI Controls
        showHeadline: true,
        showSlides: true,
        showDesignStyle: true,
        showPlatforms: false,


        // Text Labels
        title: "Carousel Post Generator",
        subtitle: "Generate multi-slide content for social platforms",
        descriptionLabel: "Carousel Description",

        // Placeholders
        placeholders: {
            headline: "Enter main headline...",
            slides: "Enter number of slides",
            designStyle: "Select design style..."
        },

        // Actual Form Values
        form: {
            headline: "",
            slides: 5,
            designStyle: null,
            includeIcons: true
        }
    },

    blog: {
        // UI Controls
        showTitle: true,
        showContent: true,
        showKeywords: true,
        showSeoOptions: true,

        // Text Labels
        title: "Blog Content Generator",
        subtitle: "Create SEO-optimized blog posts effortlessly",

        // Placeholders
        placeholders: {
            blogTitle: "Enter the blog title...",
            content: "Describe the blog content...",
            keywords: "Enter SEO keywords..."
        },

        // Actual Form Values
        form: {
            blogTitle: "",
            content: "",
            keywords: "",
            wordLimit: 1200,
            includeImages: true
        }
    }
};
