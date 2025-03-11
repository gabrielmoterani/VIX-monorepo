class SummaryIndicator {
  constructor() {
    this.LOADED_MESSAGE = 'VIX SUMMARY: ';
  }

  show(message) {
    if (document.getElementById('vix-summary-indicator')) {
      return;
    }

    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'vix-summary-indicator';
    loadingDiv.textContent = this.LOADED_MESSAGE + message;

    // Add CSS styles to make it stay at top and push content down
    loadingDiv.style.position = 'relative';
    loadingDiv.style.width = '100%';
    loadingDiv.style.backgroundColor = '#4CAF50';
    loadingDiv.style.color = 'white';
    loadingDiv.style.padding = '10px 20px';
    loadingDiv.style.textAlign = 'center';
    loadingDiv.style.fontFamily = 'Arial, sans-serif';
    loadingDiv.style.fontSize = '14px';
    loadingDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    loadingDiv.style.cursor = 'pointer';

    // Add click handler to dismiss
    loadingDiv.addEventListener('click', () => {
      loadingDiv.remove();
    });

    document.body.insertBefore(loadingDiv, document.body.firstChild);
    return loadingDiv;
  }
}
