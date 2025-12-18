// utils/statusToStep.js

export const getStepFromStatus = (status) => {
    switch (status) {
        case "creating":
        case "running":
        case "script_generation_started":
            return 1;

        case "script_generation_completed":
        case "asset_generation_started":
            return 2;

        case "asset_generation_completed":
        case "video_generation_started":
        case "video_generation_completed":
            return 3;

        case "script_generation_failed":
        case "asset_generation_failed":
        case "video_generation_failed":
        case "failed":
            return "error";

        default:
            return 1;
    }
};
