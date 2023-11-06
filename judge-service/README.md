# Prerequisites

Before you begin, ensure you have installed:

- Docker

## Instructions to initialize Judge0

1. Open Docker.
2. Run docker compose command on the judge service.
3. After the container is up, the judge service will be listening on [http://localhost:2358](http://localhost:8082).
```bash
docker compose up -d
```

## Using the judge service

The following actions can be done:

- POST request to <http://localhost:2358/submissions> - to make a submission.
- GET request to <http://localhost:2358/submissions/{submission_token}> - to view results of a submission 
- GET request to <http://localhost:2358/languages> - to view all available languages and their id 

### Making a submission

Request:

```json
{
    "source_code": "n = input()\nprint(n)",     // mandatory field, string of the code to execute
    "language_id": 71,  // uint, mandatory field
    "stdin": "Hello World",     // string, input the code takes in
    "expected_output": "Hello World"    // string, expected output to compare code output with
}
```

Response:

```json
{
    "token": "c4d3fc00-bcf7-4eff-854e-80aada45ff51"
}
```

### Viewing results of a submission

Response:

```json
{
    "stdout": "Hello World\n",
    "time": "0.058",
    "memory": 8176,
    "stderr": null,
    "token": "c4d3fc00-bcf7-4eff-854e-80aada45ff51",
    "compile_output": null,
    "message": null,
    "status": {
        "id": 3,
        "description": "Accepted"
    }
}
```

### Viewing available languages

Response:

```json
[
    {
        "id": 45,
        "name": "Assembly (NASM 2.14.02)"
    },
    {
        "id": 46,
        "name": "Bash (5.0.0)"
    },
    {
        "id": 47,
        "name": "Basic (FBC 1.07.1)"
    },
    {
        "id": 75,
        "name": "C (Clang 7.0.1)"
    },
    {
        "id": 76,
        "name": "C++ (Clang 7.0.1)"
    },
    {
        "id": 48,
        "name": "C (GCC 7.4.0)"
    },
    {
        "id": 52,
        "name": "C++ (GCC 7.4.0)"
    },
    {
        "id": 49,
        "name": "C (GCC 8.3.0)"
    },
    {
        "id": 53,
        "name": "C++ (GCC 8.3.0)"
    },
    {
        "id": 50,
        "name": "C (GCC 9.2.0)"
    },
    {
        "id": 54,
        "name": "C++ (GCC 9.2.0)"
    },
    {
        "id": 86,
        "name": "Clojure (1.10.1)"
    },
    {
        "id": 51,
        "name": "C# (Mono 6.6.0.161)"
    },
    {
        "id": 77,
        "name": "COBOL (GnuCOBOL 2.2)"
    },
    {
        "id": 55,
        "name": "Common Lisp (SBCL 2.0.0)"
    },
    {
        "id": 56,
        "name": "D (DMD 2.089.1)"
    },
    {
        "id": 57,
        "name": "Elixir (1.9.4)"
    },
    {
        "id": 58,
        "name": "Erlang (OTP 22.2)"
    },
    {
        "id": 44,
        "name": "Executable"
    },
    {
        "id": 87,
        "name": "F# (.NET Core SDK 3.1.202)"
    },
    {
        "id": 59,
        "name": "Fortran (GFortran 9.2.0)"
    },
    {
        "id": 60,
        "name": "Go (1.13.5)"
    },
    {
        "id": 88,
        "name": "Groovy (3.0.3)"
    },
    {
        "id": 61,
        "name": "Haskell (GHC 8.8.1)"
    },
    {
        "id": 62,
        "name": "Java (OpenJDK 13.0.1)"
    },
    {
        "id": 63,
        "name": "JavaScript (Node.js 12.14.0)"
    },
    {
        "id": 78,
        "name": "Kotlin (1.3.70)"
    },
    {
        "id": 64,
        "name": "Lua (5.3.5)"
    },
    {
        "id": 89,
        "name": "Multi-file program"
    },
    {
        "id": 79,
        "name": "Objective-C (Clang 7.0.1)"
    },
    {
        "id": 65,
        "name": "OCaml (4.09.0)"
    },
    {
        "id": 66,
        "name": "Octave (5.1.0)"
    },
    {
        "id": 67,
        "name": "Pascal (FPC 3.0.4)"
    },
    {
        "id": 85,
        "name": "Perl (5.28.1)"
    },
    {
        "id": 68,
        "name": "PHP (7.4.1)"
    },
    {
        "id": 43,
        "name": "Plain Text"
    },
    {
        "id": 69,
        "name": "Prolog (GNU Prolog 1.4.5)"
    },
    {
        "id": 70,
        "name": "Python (2.7.17)"
    },
    {
        "id": 71,
        "name": "Python (3.8.1)"
    },
    {
        "id": 80,
        "name": "R (4.0.0)"
    },
    {
        "id": 72,
        "name": "Ruby (2.7.0)"
    },
    {
        "id": 73,
        "name": "Rust (1.40.0)"
    },
    {
        "id": 81,
        "name": "Scala (2.13.2)"
    },
    {
        "id": 82,
        "name": "SQL (SQLite 3.27.2)"
    },
    {
        "id": 83,
        "name": "Swift (5.2.3)"
    },
    {
        "id": 74,
        "name": "TypeScript (3.7.4)"
    },
    {
        "id": 84,
        "name": "Visual Basic.Net (vbnc 0.0.0.5943)"
    }
]
```

## Judge0 configurations

- The configuration details are in judge0.conf
