import Conf from 'conf';

// Initialize configuration with default values
const config = new Conf({
  projectName: 'codetalk',
  defaults: {
    apiKey: null
  }
});

// Function to set API key in configuration
export async function configureAPI({ apiKey }) {
  config.set('apiKey', apiKey);
}

// Function to get current configuration
export async function getConfig() {
  return {
    apiKey: config.get('apiKey')
  };
}