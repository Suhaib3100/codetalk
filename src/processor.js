import fs from 'fs/promises';
import path from 'path';
import { getCompletion } from './ai.js';

export async function processFiles({ files, commentStyle, apiKey }) {
  let filesProcessed = 0;
  let commentsAdded = 0;

  for (const file of files) {
    try {
      const content = await fs.readFile(file, 'utf-8');
      const commentedCode = await addComments(content, {
        fileExtension: path.extname(file),
        commentStyle,
        apiKey
      });
      
      if (commentedCode) {
        await fs.writeFile(file, commentedCode);
        filesProcessed++;
        commentsAdded += countNewComments(content, commentedCode);
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  return { filesProcessed, commentsAdded };
}

async function addComments(code, { fileExtension, commentStyle, apiKey }) {
  const prompt = `You are a code documentation expert. Add minimal, focused comments to the following ${fileExtension} code with these strict rules:
  1. DO NOT modify any existing code - only add comments
	2. Never Use ''' in start and end of the code by mentioning the language name
  3. Add comments ONLY for:
     - Function declarations (brief description of purpose)
     - Complex logic blocks
     - Important class declarations
     - Critical business logic
  4. Keep comments brief and to the point
  5. Comment no more than 20% of the code lines
  6. Use the appropriate comment style for the language
  7. Return the COMPLETE code with your minimal comments added
  8. Do not add ''' to starting and ending of the code by specifying the languge name
  ${commentStyle === 'basic' ? 'Keep comments very brief and only for the most important elements.' : 'Add slightly more detailed comments but still be concise.'}

  CODE:
  ${code}`;

  const commentedCode = await getCompletion(prompt, apiKey);
  
  // Verify we got back valid code with comments
  if (!commentedCode || commentedCode.trim().length < code.trim().length) {
    console.warn('Invalid response from AI - skipping file');
    return null;
  }

  return commentedCode;
}

function countNewComments(originalCode, commentedCode) {
  const originalComments = (originalCode.match(/\/\*[\s\S]*?\*\/|\/\/.*/g) || []).length;
  const newComments = (commentedCode.match(/\/\*[\s\S]*?\*\/|\/\/.*/g) || []).length;
  return newComments - originalComments;
}
