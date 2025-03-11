# VIX-monorepo

## Overview
VIX (Visual Impairement Extension) is a mobile web browser extension designed to enhance accessibility for individuals with vision disabilities by replacing missing alt tags on web pages.

## Purpose

This project is part of a research made during Agoma University Master Degree in Computer Science. The research aims on using AI and ML to provide better experience while navigating web for people with visual impairment.

## Author
The Author of this Project is Gabriel Moterani (TL Studio CTO) and Dr. Randy Lin (Algoma U Professor).

## Features
- Automatically replaces missing alt tags on images.
- Add WCAG and ARIA tags using the context from the page.
- Sumarizes pages.

## Prerequisites
Before you begin, ensure you have met the following requirements:
- [Firefox Nightly](https://www.mozilla.org/en-US/firefox/channel/desktop/#nightly) installed.
- Latest version of [Node.js](https://nodejs.org/) installed.

## Installation and Running
To install and run the GTKN Blind Extension, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gabrielmoterani/VIX-monorepo.git extension
   cd VIX-monorepo/extension
   ```

2. **Install the dependencies:**
   ```bash
   npm install
   ```

3. **Run the extension:**
   ```bash
   npm start
   ```
   This command will launch Firefox Nightly with the extension loaded.

## Testing the Extension
To test the extension:

1. After running `npm start`, Firefox Nightly will open with the extension installed.
2. Navigate to any webpage.
3. The extension should automatically run when the page loads. Check the browser console for logs indicating that the extension is working:
   - "Script executed at [timestamp]"
   - "LOAD HANDLER CALLED at [timestamp]"
4. If everything is working correctly, you should see the JSON representation of the page's DOM in the console, followed by the alt content received from the server.
5. To verify that the extension is modifying alt tags, inspect image elements on the page and check if their alt attributes have been updated.

## Troubleshooting
If you encounter any issues:
1. Ensure you're using Firefox Nightly and the latest version of Node.js.
2. Check the browser console for any error messages.
3. Ensure that your `manifest.json` file is correctly configured.
4. Verify that all the required files (`background.js`, `domToJson.js`, `substitute.js`, `pageHandler.js`) are present in your extension directory.

For any further issues, please open an issue in the GitHub repository.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Thanks to the contributors and the open-source community for their support.
