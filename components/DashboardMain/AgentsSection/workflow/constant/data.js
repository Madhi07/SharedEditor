export let menuOptions = [
    {
        id: "trigger-manually",
        title: "Trigger manually",
        description: "Runs the flow on clicking a button in n8n. Good for getting started quickly",
        type: "trigger",
        icon: "cursor",
        handles: [
            { type: "source", position: "right" }
        ]
    },
    {
        id: "on-app-event",
        title: "On app event",
        description: "Runs the flow when something happens in an app like Telegram, Notion or Airtable",
        type: "trigger",
        icon: "app-event",
        handles: [
            { type: "source", position: "right" }
        ]
    },
    {
        id: "if-node",
        title: "If",
        description: "Adds conditional logic to your workflow",
        type: "logic",
        icon: "if",
        handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right", id: "true" },
            { type: "source", position: "bottom", id: "false" }
        ]
    },
    {
        id: "no-op",
        title: "No Operation",
        description: "Placeholder node that does nothing",
        type: "utility",
        icon: "no-op",
        handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right" }
        ]
    },
    {
        id: "split-in-batches",
        title: "Split in Batches",
        description: "Splits items into multiple batches for processing",
        type: "logic",
        icon: "splitIn-batches",
        handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right", id: "nextBatch" }
        ]
    },
    {
        id: "switch",
        title: "Switch",
        description: "Route execution based on conditions",
        type: "logic",
        icon: "switch",
        handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right", id: "case1" },
            { type: "source", position: "bottom", id: "case2" },
            { type: "source", position: "top", id: "default" }
        ]
    }
]

export let actionsOptionsList = [
    {
        id: "google-sheets",
        provider_id: "sheet",
        name: "Google Sheets",
        icon: "sheets",
        title: "Automate with Google Sheets",
        description: "Create, update, and manage spreadsheet data seamlessly through workflows.",
        oauth: true,
        handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right" }
        ]
    },
    {
        id: "google-docs",
        provider_id: "docs",
        name: "Google Docs",
        icon: "docs",
        title: "Work Smarter with Google Docs",
        description: "Generate, edit, and organize documents automatically as part of your flows.",
        oauth: true,
        handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right" }
        ]
    },
    {
        id: "google-ads",
        provider_id: "adwords",
        name: "Google Ads",
        icon: "adwords",
        title: "Optimize Google Ads Campaigns",
        description: "Automate ad creation, reporting, and performance tracking to boost ROI.",
        oauth: true,
        handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right" }
        ]
    },
    {
        id: "google-gmail",
        provider_id: "email",
        name: "Google Gmail",
        icon: "gmail",
        title: "Streamline Gmail Workflows",
        description: "Send, receive, and organize emails effortlessly with automated triggers.",
        oauth: true,
        handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right" }
        ]
    },
    {
        id: "if-node",
        provider_id: "logic",
        name: "If",
        icon: "if",
        title: "Conditional Logic (If)",
        description: "Adds conditional logic to your workflow and branches based on true/false.",
        oauth: false,
        inputOptions: [
            { name: "condition", type: "expression", label: "Condition" }
        ],
        handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right", id: "true" },
            { type: "source", position: "bottom", id: "false" }
        ]
    },
    {
        id: "no-op",
        provider_id: "utility",
        name: "No Operation",
        icon: "no-op",
        title: "No Operation (No-Op)",
        description: "A placeholder node that does nothing. Useful for testing workflow paths.",
        oauth: false,
        inputOptions: [],
        handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right" }
        ]
    },
    {
        id: "switch",
        provider_id: "logic",
        name: "Switch",
        icon: "switch",
        title: "Switch Node",
        description: "Route execution to different branches based on conditions.",
        oauth: false,
        inputOptions: [
            { name: "cases", type: "array", label: "Cases", default: ["case1", "case2"] }
        ],
        handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right", id: "case1" },
            { type: "source", position: "bottom", id: "case2" },
            { type: "source", position: "top", id: "default" }
        ]
    },
    {
        id: "split-in-batches",
        provider_id: "logic",
        name: "Split in Batches",
        icon: "splitIn-batches",
        title: "Split in Batches",
        description: "Splits items into multiple batches for controlled processing.",
        oauth: false,
        inputOptions: [
            { name: "batchSize", type: "number", label: "Batch Size", default: 10 }
        ],
        handles: [
            { type: "target", position: "left" },
            { type: "source", position: "right", id: "nextBatch" }
        ]
    }
]
