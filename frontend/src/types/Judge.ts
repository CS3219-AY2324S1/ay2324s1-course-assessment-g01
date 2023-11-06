export type JudgeToken = {
    "token" : string;
}

export type CodeSubmission = {
    "source_code" : string | null;
    "language_id" : number | null;
    "stdin" : string | undefined;
    "expected_output" : string | undefined;
}

export type CodeResult = {
    "stdout" : string | null;
    "time" : string | null;
    "memory" : number | null;
    "stderr" : string | null;
    "token" : string;
    "compile_output": string | null;
    "message": string | null;
    "status": {
        "id" : number; 
        "description" : string;
    }
}