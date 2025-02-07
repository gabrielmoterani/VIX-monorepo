const API_URL = "https://11uhx8j6hf.execute-api.us-east-1.amazonaws.com/default/GTKN-Lambda"

let requestAltContentFromServer = (pageJson) => {
    console.log(JSON.stringify(pageJson))
    return fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(pageJson),
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
    });
}

// Use runtime.onMessage for cross-browser compatibility
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'requestAltContent') {
        requestAltContentFromServer(message.pageJson)
            .then(response => {
                sendResponse({ success: true, data: response });
            })
            .catch(error => {
                sendResponse({ success: false, error: error.message });
            });
        return true; 
    }
});
