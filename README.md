# CodeTalk

An AI-powered CLI tool that automatically adds intelligent comments to your codebase.

## Installation

```bash
npm install -g codetalk
```

## Usage

### Configure API Key
First, configure your OpenAI API key:
```bash
codetalk configure
```

### Add Comments to Code
Process a specific file:
```bash
codetalk comment --file path/to/file.js
```

Process all files in a directory:
```bash
codetalk comment --directory ./src
```

Process files matching a pattern:
```bash
codetalk comment --pattern "**/*.js"
```

## Features

- AI-powered code analysis and commenting
- Support for multiple programming languages
- Smart comment generation based on code context
- Configurable file patterns and directories
- Beautiful CLI interface
- Progress tracking and summary statistics

## Supported File Types

- JavaScript (.js)
- TypeScript (.ts)
- JSX/TSX (.jsx, .tsx)
- Python (.py)
- Java (.java)
- C++ (.cpp)
- C (.c)
- Ruby (.rb)

## License

MIT
