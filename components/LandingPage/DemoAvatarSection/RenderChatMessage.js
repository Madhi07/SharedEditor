import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function RenderChatMessage({ message = "" }) {

    return (
        <Markdown
            remarkPlugins={[remarkGfm]}
            // components={}
        >
            {message}
        </Markdown>
    )
}


function extractProducts(markdown) {
    const lines = markdown.split('\n');
    const products = [];

    let current = {};

    for (let line of lines) {
        // Product name starts with "###"
        if (line.startsWith('###')) {
            if (Object.keys(current).length) {
                products.push(current);
            }
            current = { name: line.replace(/^###\s*\d+\.\s*/, '').trim() };
        }

        // Price line
        if (line.startsWith('- **Price:**')) {
            const match = line.match(/\*\*Price:\*\*\s*(SGD[\d,]+\.\d{2})/);
            if (match) {
                current.price = match[1];
            }
        }
        // Price
        if (line.includes('**Price:**')) {
            const match = line.match(/\*\*Price:\*\*\s*(SGD\s*[\d,]+\.\d{2})/i);
            if (match) {
                current.price = match[1].trim();
            }
        }


        // Image line
        if (line.startsWith('- **Preview:**')) {
            const match = line.match(/\!\[.*\]\((https?:\/\/[^\s)]+)\)/);
            if (match) {
                current.image = match[1];
            }
        }

        // Link (any markdown link)
        if (line.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/)) {
            const match = line.match(/\[.*?\]\((https?:\/\/[^\s)]+)\)/);
            if (match) {
                current.link = match[1];
            }
        }
    }

    // Push the last product if exists
    if (Object.keys(current).length) {
        products.push(current);
    }

    return products;
}

function getPreviewElement(url) {
    if (url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/)) {
        return `<img src="${url}"  alt="Image Preview" style="width: 100%;height: 20vh;object-fit: contain;text-align: center;display: block;margin-left: auto;">`;
    } else if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = url.split("v=")[1] || url.split("/").pop();
        return `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    } else if (url.match(/\.(mp3|ogg|wav)$/)) {
        return `<audio controls src="${url}"></audio>`;
    } else {
        return `<iframe src="${url}" width="100%" height="200px" style="border: none;"></iframe>`;
    }
}