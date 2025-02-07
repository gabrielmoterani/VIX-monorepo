# GTKN Blind Extension

This browser extension replaces missing alt tags on web pages.

## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed [Firefox Nightly](https://www.mozilla.org/en-US/firefox/channel/desktop/#nightly)
* You have installed the latest version of [Node.js](https://nodejs.org/)

## Installing and Running GTKN Blind Extension

To install and run GTKN Blind Extension, follow these steps:

1. Clone the repository:
```
git clone https://github.com/gabrielmoterani/GTKN-monorepo.git 
cd GTKN-monorepo/extension
```


2. Install the dependencies:
```
npm install
```


3. Run the extension:
```
npm start
```


This command will launch Firefox Nightly with the extension loaded.

## Testing GTKN Blind Extension

To test the extension:

1. After running `npm start`, Firefox Nightly will open with the extension installed.

2. Navigate to any webpage.

3. The extension should automatically run when the page loads. Check the browser console for logs indicating that the extension is working:
- "Script executed at [timestamp]"
- "LOAD HANDLER CALLED at [timestamp]"

4. If everything is working correctly, you should see the JSON representation of the page's DOM in the console, followed by the alt content received from the server.

5. To verify that the extension is modifying alt tags, you can inspect image elements on the page and check if their alt attributes have been updated.

## Troubleshooting

If you encounter any issues:

1. Make sure you're using Firefox Nightly and the latest version of Node.js.
2. Check the browser console for any error messages.
3. Ensure that your `manifest.json` file is correctly configured.
4. Verify that all the required files (`background.js`, `domToJson.js`, `substitute.js`, `pageHandler.js`) are present in your extension directory.

For any further issues, please open an issue in the GitHub repository.
This README provides a clear guide on how to set up, run, and test the GTKN Blind Extension. It includes the prerequisites (Firefox Nightly and the latest Node.js), installation steps, running instructions, and basic testing procedures. It also includes a troubleshooting section for common issues that users might encounter.





