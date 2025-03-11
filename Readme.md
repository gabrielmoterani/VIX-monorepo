# VIX-monorepo

## Overview
VIX (Visual Impairment Extension) is a mobile web browser extension designed to enhance accessibility for individuals with vision disabilities by replacing missing alt tags on web pages.

## Purpose
This project is part of a research made during Algoma University Master Degree in Computer Science. The research aims on using AI and ML to provide better experience while navigating web for people with visual impairment.

## Author
The Author of this Project is Gabriel Moterani (TL Studio CTO) and Dr. Randy Lin (Algoma U Professor).

## Features
- Automatically replaces missing alt tags on images.
- Add WCAG and ARIA tags using the context from the page.
- Summarizes pages.

## Architecture
The project is structured as a monorepo containing two main components:
- `extension/`: Firefox browser extension (frontend)
- `backend/`: Python-based API server for AI processing

### Extension
The browser extension component that handles:
- DOM manipulation and monitoring
- Image detection and processing
- Communication with the backend API
- ARIA and WCAG tag management

### Backend
Python-based server that provides:
- RESTful API endpoints for image processing
- AI/ML models for image analysis
- Context-aware alt text generation
- Page summarization services

## Prerequisites
Before you begin, ensure you have met the following requirements:
- [Firefox Nightly](https://www.mozilla.org/en-US/firefox/channel/desktop/#nightly) installed
- Latest version of [Node.js](https://nodejs.org/) installed
- Python 3.8+ installed
- Conda or Python virtual environment manager (recommended)

## Installation and Running

### Frontend Extension
1. **Clone the repository:**
   ```bash
   git clone https://github.com/gabrielmoterani/VIX-monorepo.git
   cd VIX-monorepo
   ```

2. **Install the extension dependencies:**
   ```bash
   cd extension
   npm install
   ```

3. **Run the extension:**
   ```bash
   npm start
   ```
   This command will launch Firefox Nightly with the extension loaded.

### Backend Server
1. **Set up the Python environment:**
   ```bash
   cd backend
   conda env create -f environment.yml
   conda activate vix-backend
   # Or if using venv:
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Configure environment variables:**
   Create a `.env` file in the backend directory with necessary API keys and configurations.

3. **Start the backend server:**
   ```bash
   python app.py
   ```
   The server will start on the configured port (default: 5000).

## Testing the Extension
To test the extension:

1. After running `npm start`, Firefox Nightly will open with the extension installed.
2. Ensure the backend server is running.
3. Navigate to any webpage.
4. The extension should automatically run when the page loads. Check the browser console for logs:
   - "Script executed at [timestamp]"
   - "LOAD HANDLER CALLED at [timestamp]"
5. If everything is working correctly, you should see the JSON representation of the page's DOM in the console, followed by the alt content received from the server.
6. To verify that the extension is modifying alt tags, inspect image elements on the page and check if their alt attributes have been updated.

## Troubleshooting
If you encounter any issues:
1. Ensure you're using Firefox Nightly and the latest version of Node.js.
2. Check the browser console for any error messages.
3. Verify the backend server is running and accessible.
4. Ensure that your `manifest.json` file is correctly configured.
5. Check that all required files are present in both extension and backend directories.
6. Verify your environment variables are properly set.

For any further issues, please open an issue in the GitHub repository.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Thanks to the contributors and the open-source community for their support.
