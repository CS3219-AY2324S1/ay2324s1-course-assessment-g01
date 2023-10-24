export enum Actions {
    start = "Start",
    cancel = "Cancel",
    stop = "Stop"
}

export const matchingServiceURL = "ws://" + location.host    + "/ws";

export const matchingMessage = (userId : number | undefined, action : string, difficulty : string, jwt : string | null) => {
    return JSON.stringify({
        "user_id": userId,
        "action": action,
        "difficulty": difficulty,
        "jwt": jwt
    });
};
