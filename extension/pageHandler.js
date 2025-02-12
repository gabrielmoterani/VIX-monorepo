const LOADING_MESSAGE = 'Loading alt content';
const LOADED_MESSAGE = 'Added additonal alt content';

const handleLoad = async () => {
  console.log("LOAD HANDLER CALLED at", new Date().toISOString());
  
  const loadingDiv = createLoadingMessageDiv();
  changeDivText(loadingDiv, LOADING_MESSAGE);
  const jsonResult = domToJson(document.body);

  try {
    const altContent = await requireRequestToAltServer(jsonResult);
    const altContentElements = retrieveElementsToChangeContent(altContent);
    findByIdOrContentAndSubstituteAltContent(altContentElements);

    // Update loading message
    changeDivText(loadingDiv, LOADED_MESSAGE);
    fadeOutElement(loadingDiv)
  } catch (error) {
    console.error('Error loading alt content:', error);
    loadingDiv.textContent = 'Error loading alt content: ' + error || '';
    console.log(jsonResult)
  }
};

// Run the conversion when the page is loaded
window.addEventListener('load', handleLoad);

// Add a DOMContentLoaded listener as a fallback
document.addEventListener('DOMContentLoaded', () => {
  if (!window.loadHandlerCalled) {
    handleLoad();
  }
});

// Add an immediate execution as a last resort
console.log("Script executed at", new Date().toISOString());
if (document.readyState === 'complete') {
  handleLoad();
} 
// Flag to check if the load handler was called
window.loadHandlerCalled = false;
