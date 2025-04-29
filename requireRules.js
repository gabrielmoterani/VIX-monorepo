const fs = require('node:fs');
const https = require('node:https');

const url = 'https://easylist.to/easylist/easylist.txt';

// Function to download the file
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https
      .get(url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', (err) => {
        fs.unlink(destination, () => {}); // Delete the file if there's an error
        reject(err);
      });
  });
}

// Main function to process the rules
async function processRules() {
  try {
    // Download the file
    await downloadFile(url, 'easylist.txt');

    // Read and parse the rules
    const easylist = fs.readFileSync('easylist.txt', 'utf8').replace('[Adblock Plus 2.0]', '');
    const rules = easylist.split('\n').filter((rule) => rule && !rule.startsWith('!'));

    // Create a JavaScript module that exports the rules array
    const jsContent = `// Auto-generated ad-block rules
// Source: ${url}
// Generated on: ${new Date().toISOString()}

// Export the rules array
const baseAdBlockRules = ${JSON.stringify(rules, null, 2)};
`;

    // Write the rules to a JavaScript file
    fs.writeFileSync('./extension/src/external-libs/ad-block-rules.js', jsContent);

    fs.unlinkSync('easylist.txt');

    console.log(`Successfully processed ${rules.length} rules and saved to ad-block-rules.js`);
  } catch (error) {
    console.error('Error processing rules:', error);
  }
}

// Execute the main function
processRules();
