
<p align="center">
  <img src="https://img.shields.io/github/languages/top/Suhaib3100/codetalk" alt="Language" />
  <img src="https://img.shields.io/github/stars/Suhaib3100/codetalk" alt="Stars" />
  <img src="https://img.shields.io/github/issues-pr/Suhaib3100/codetalk" alt="Pull Requests" />
  <img src="https://img.shields.io/github/issues/Suhaib3100/codetalk" alt="Issues" />
  <img src="https://img.shields.io/github/contributors/Suhaib3100/codetalk" alt="Contributors" />
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/OpenAI-00A400?logo=openai&logoColor=white" alt="OpenAI" />
</p>

## Overview

**CodeTalk** is an AI-powered CLI tool designed to streamline code commenting. It leverages the OpenAI API to generate clear, concise comments for your code, enhancing documentation and improving code readability effortlessly.

## Features

- **AI-Powered Commenting**: Automatically generate comments for functions, classes, and complex logic.
- **Flexible Usage**: Comment on all files, select specific files, or use file patterns.
- **User-Friendly CLI**: Intuitive command-line interface for easy interaction.

## Run Locally

1. Clone the CodeTalk repository:  
   ```bash  
   git clone https://github.com/Suhaib3100/codetalk
   ```

2. Navigate to the project directory:
   ```bash
   cd codetalk
   ```

3. Install the dependencies with one of the package managers listed below:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

4. Start the development mode:
   ```bash
   npm start
   ```

## Usage

To use CodeTalk, install it globally or locally:

1. Install CodeTalk:
   ```bash
   npm i codetalk
   ```

2. Run CodeTalk using `npx`:
   ```bash
   npx codetalk
   ```

## API Endpoints

### Health Check
- **GET /health**  
  **Description**: Check if the server is running.  
  **Response**:  
  ```json
  { "status": "Server is running" }
  ```

### Commenting Endpoint
- **POST /comment**  
  **Description**: Generate comments for the provided code.  
  **Request Body**:  
  ```json
  {
    "code": "function add(a, b) { return a + b; }",
    "commentStyle": "basic"
  }
  ```

  **Response**:  
  ```json
  {
    "commentedCode": "// Function to add two numbers
function add(a, b) { return a + b; }"
  }
  ```

## Changelog

- **[Version 1.0.0]** - YYYY-MM-DD  
  Initial release with core functionality.

## Roadmap

- Task 1: Implement support for additional programming languages.
- Task 2: Enhance commenting styles and options.
- Task 3: Add a web interface for easier usage.

## FAQ

1. **What is this project about?**  
   CodeTalk aims to simplify the process of adding comments to code, making it easier for developers to maintain and understand their projects.

2. **How can I contribute to this project?**  
   We welcome contributions! Please refer to our [Contribution Guidelines](CONTRIBUTING.md) for more information on how to contribute.

3. **What technologies are used in this project?**  
   This project uses Node.js, Express.js, and the OpenAI API to provide intelligent code commenting.

## Contributors

[See the full list of contributors here](https://github.com/Suhaib3100/codetalk/graphs/contributors).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
