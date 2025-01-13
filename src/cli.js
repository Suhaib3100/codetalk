#!/usr/bin/env node
    import inquirer from 'inquirer';
    import chalk from 'chalk';
    import ora from 'ora';
    import boxen from 'boxen';
    import Table from 'cli-table3';
    import { glob } from 'glob';
    import path from 'path';
    import fs from 'fs/promises';
    import axios from 'axios';

    const API_URL = 'https://codetalk-server.onrender.com/comment';
    const SIGNUP_URL = 'https://codetalk-server.onrender.com/signup';
    const LOGIN_URL = 'https://codetalk-server.onrender.com/login';
    const CREDENTIALS_FILE = path.join(process.cwd(), 'credentials.json');

    async function saveCredentials(email, password) {
      await fs.writeFile(CREDENTIALS_FILE, JSON.stringify({ email, password }));
    }

    async function loadCredentials() {
      try {
        const data = await fs.readFile(CREDENTIALS_FILE, 'utf-8');
        return JSON.parse(data);
      } catch (error) {
        return null; // Return null if the file does not exist
      }
    }

    async function getCommentData(email) {
      // This function will be used to fetch comment data
      return { remaining: 5, total: 5 }; // Mock data
    }

    async function getProjectStructure() {
      const files = await glob('**/*.{js,ts,jsx,tsx,py,java,cpp,c,rb}', {
        ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**']
      });
      
      return files.reduce((acc, file) => {
        const ext = path.extname(file);
        if (!acc[ext]) acc[ext] = [];
        acc[ext].push(file);
        return acc;
      }, {});
    }

    function displayProjectStructure(structure) {
      const table = new Table({
        head: [chalk.blue('Extension'), chalk.blue('Count'), chalk.blue('Files')],
        style: { head: [], border: [] }
      });

      Object.entries(structure).forEach(([ext, files]) => {
        table.push([
          ext,
          files.length,
          files.length > 3 
            ? `${files.slice(0, 3).join('\n')}...` 
            : files.join('\n')
        ]);
      });

      console.log(table.toString());
    }

    async function validateFiles(files) {
      const validFiles = [];
      for (const file of files) {
        try {
          await fs.access(file);
          validFiles.push(file);
        } catch (error) {
          console.warn(chalk.yellow(`Warning: File not accessible: ${file}`));
        }
      }
      return validFiles;
    }

    async function callCloudAPI(code, commentStyle, email) {
      const response = await axios.post(API_URL, {
        email,
        code,
        commentStyle
      });
      return response.data.commentedCode;
    }

    async function signup(email, password) {
      try {
        const response = await axios.post(SIGNUP_URL, { email, password });
        return response.data;
      } catch (error) {
        console.error('Error during sign-up:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error to handle it in the main function
      }
    }

    async function login(email, password) {
      try {
        const response = await axios.post(LOGIN_URL, { email, password });
        return response.data;
      } catch (error) {
        console.error('Error during login:', error.response ? error.response.data : error.message);
        throw error; // Rethrow the error to handle it in the main function
      }
    }

    async function testAPI() {
      const data = {
        email: 'user@example.com', // Replace with actual email logic
        password: 'password123', // Replace with actual password logic
        code: "function add(a, b) { return a + b; }",
        commentStyle: "basic"
      };

      try {
        const response = await axios.post(API_URL, data);
        console.log('API Response:', response.data);
      } catch (error) {
        console.error('Error:', error.message);
      }
    }

    async function main() {
      console.log(boxen(chalk.bold.blue('CodeTalk - AI Code Commenting Tool'), {
        padding: 1,
        margin: 1,
        borderStyle: 'double',
        borderColor: 'blue'
      }));

      // Load existing credentials
      const credentials = await loadCredentials();

      let email, password;

      if (credentials) {
        email = credentials.email;
        password = credentials.password;
        console.log(chalk.green(`Welcome back, ${email}!`));
      } else {
        const { apiChoice } = await inquirer.prompt([
          {
            type: 'list',
            name: 'apiChoice',
            message: 'Would you like to use your own API or the cloud service?',
            choices: ['Own API', 'Cloud Service']
          }
        ]);

        if (apiChoice === 'Own API') {
          const { code, commentStyle } = await inquirer.prompt([
            {
              type: 'input',
              name: 'code',
              message: 'Please enter the code you want to comment on:',
            },
            {
              type: 'list',
              name: 'commentStyle',
              message: 'What type of commenting do you prefer?',
              choices: [
                { name: 'Basic - Essential function and class documentation', value: 'basic' },
                { name: 'Advanced - Detailed explanations with examples', value: 'advanced' }
              ]
            }
          ]);

          // Call own API logic here
          console.log('Using own API to comment on the code...');
          // Implement own API logic as needed

        } else {
          email = await inquirer.prompt([
            {
              type: 'input',
              name: 'email',
              message: 'Please enter your email:',
            }
          ]).then(res => res.email);

          password = await inquirer.prompt([
            {
              type: 'password',
              name: 'password',
              message: 'Please enter your password:',
            }
          ]).then(res => res.password);

          const { action } = await inquirer.prompt([
            {
              type: 'list',
              name: 'action',
              message: 'Would you like to sign up or log in?',
              choices: ['Sign Up', 'Log In']
            }
          ]);

          if (action === 'Sign Up') {
            const spinner = ora('Signing up...').start();
            await signup(email, password);
            await saveCredentials(email, password);
            spinner.succeed('Sign up successful!');
          } else {
            const spinner = ora('Logging in...').start();
            await login(email, password);
            await saveCredentials(email, password);
            spinner.succeed('Login successful!');
          }
        }
      }

      const commentData = await getCommentData(email);
      console.log(chalk.green(`Total Comments Available: ${commentData.total}`));
      console.log(chalk.green(`Remaining Comments Today: ${commentData.remaining}`));

      const { action2 } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action2',
          message: 'What would you like to do?',
          choices: ['Test API', 'Comment Code', 'Exit']
        }
      ]);

      if (action2 === 'Test API') {
        const spinner = ora('Testing API...').start();
        await testAPI();
        spinner.succeed('API test completed.');
      } else if (action2 === 'Comment Code') {
        const spinner = ora('Analyzing project structure...').start();
        const structure = await getProjectStructure();
        spinner.succeed('Project structure analyzed!');

        console.log('\nFound files in your project:');
        displayProjectStructure(structure);

        const answers = await inquirer.prompt([
          {
            type: 'list',
            name: 'scope',
            message: 'What would you like to comment?',
            choices: [
              { name: 'All files', value: 'all' },
              { name: 'Select specific files', value: 'specific' },
              { name: 'Files by pattern', value: 'pattern' }
            ]
          },
          {
            type: 'list',
            name: 'commentStyle',
            message: 'What type of commenting do you prefer?',
            choices: [
              { name: 'Basic - Essential function and class documentation', value: 'basic' },
              { name: 'Advanced - Detailed explanations with examples', value: 'advanced' }
            ]
          }
        ]);

        let filesToProcess = [];

        if (answers.scope === 'all') {
          filesToProcess = Object.values(structure).flat();
        } else if (answers.scope === 'specific') {
          const fileChoices = await inquirer.prompt([
            {
              type: 'checkbox',
              name: 'selectedFiles',
              message: 'Select files to comment:',
              choices: Object.values(structure).flat().map(file => ({
                name: file,
                value: file
              }))
            }
          ]);
          filesToProcess = fileChoices.selectedFiles;
        } else {
          const patternChoice = await inquirer.prompt([
            {
              type: 'input',
              name: 'pattern',
              message: 'Enter file pattern (e.g., "src/**/*.js"):',
              default: '**/*.js'
            }
          ]);
          filesToProcess = await glob(patternChoice.pattern, {
            ignore: ['node_modules/**', 'dist/**', 'build/**', '.git/**']
          });
        }

        if (filesToProcess.length === 0) {
          console.log(chalk.yellow('\nNo files selected for processing.'));
          process.exit(0);
        }

        // Validate files exist and are accessible
        filesToProcess = await validateFiles(filesToProcess);

        if (filesToProcess.length === 0) {
          console.log(chalk.red('\nNo valid files to process.'));
          process.exit(1);
        }

        const processingSpinner = ora('Adding comments to your code...').start();
        
        try {
          for (const file of filesToProcess) {
            const content = await fs.readFile(file, 'utf-8');
            const commentedCode = await callCloudAPI(content, answers.commentStyle, email);
            await fs.writeFile(file, commentedCode);
          }
          
          processingSpinner.succeed('Successfully added comments to your code!');
        } catch (error) {
          processingSpinner.fail('Error processing files');
          console.error(chalk.red('Error:', error.message));
          process.exit(1);
        }
      } else {
        console.log('Exiting...');
        process.exit(0);
      }

      // Add credits
      console.log(chalk.blue('\n\nCreated by Suhaib King'));
      console.log(chalk.blue('GitHub: https://github.com/Suhaib3100/codetalk'));
    }

    main().catch(error => {
      console.error(chalk.red('Error:', error.message));
    });
