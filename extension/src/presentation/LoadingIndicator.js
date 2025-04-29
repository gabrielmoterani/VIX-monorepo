class LoadingIndicator {
  constructor() {
    this.LOADING_MESSAGE = 'Loading VIX';
    this.LOADED_MESSAGE = 'Added alternative content';
    this.LABELED_MESSAGE = 'VIX MESSAGE: ';
  }

  show() {
    if (document.getElementById('alt-content-loading')) {
      return;
    }

    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'alt-content-loading';
    loadingDiv.textContent = this.LABELED_MESSAGE + this.LOADING_MESSAGE;

    // Add CSS styles to make it float on top and look better
    loadingDiv.style.position = 'fixed';
    loadingDiv.style.bottom = '0';
    loadingDiv.style.left = '0';
    loadingDiv.style.width = '100%';
    loadingDiv.style.backgroundColor = '#2196F3'; // Different color to distinguish from summary
    loadingDiv.style.color = 'white';
    loadingDiv.style.padding = '10px 20px';
    loadingDiv.style.zIndex = '999998'; // Slightly lower than summary
    loadingDiv.style.textAlign = 'center';
    loadingDiv.style.fontFamily = 'Arial, sans-serif';
    loadingDiv.style.fontSize = '14px';
    loadingDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    loadingDiv.style.cursor = 'pointer'; // Show pointer on hover

    // Add click handler to dismiss
    loadingDiv.addEventListener('click', () => {
      loadingDiv.remove();
    });

    document.body.insertBefore(loadingDiv, document.body.firstChild);
    return loadingDiv;
  }

  updateStatus(element, message) {
    if (!element) {
      return;
    }
    element.textContent = this.LABELED_MESSAGE + message;
  }

  showError(element, error) {
    if (!element) {
      return;
    }
    element.textContent = `Error loading alt content: ${error?.message || ''}`;
    element.style.backgroundColor = '#f44336'; // Red background for errors
  }

  fadeOut(element) {
    element.style.transition = 'opacity 1s';
    setTimeout(() => {
      element.style.opacity = '0';
      setTimeout(() => {
        element.remove();
      }, 1000);
    }, 9000);
  }
}
