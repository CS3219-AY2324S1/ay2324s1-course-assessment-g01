export enum Actions {
    start = "Start",
    cancel = "Cancel",
    stop = "Stop"
}

export const matchingServiceURL = import.meta.env.VITE_MATCHING_SERVICE_URL;

export const matchingMessage = (userId : number | undefined, action : string, difficulty : string, jwt : string | null) => {
    return JSON.stringify({
        "user_id": userId,
        "action": action,
        "difficulty": difficulty,
        "jwt": jwt
    });
};
