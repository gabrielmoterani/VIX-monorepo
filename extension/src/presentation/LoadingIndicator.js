class LoadingIndicator {
  constructor() {
    this.LOADING_MESSAGE = 'Loading alt content';
    this.LOADED_MESSAGE = 'Added additional alt content';
  }

  show() {
    if (document.getElementById('alt-content-loading')) {
      return;
    }

    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'alt-content-loading';
    loadingDiv.textContent = this.LOADING_MESSAGE;
    document.body.insertBefore(loadingDiv, document.body.firstChild);
    return loadingDiv;
  }

  updateStatus(element, message) {
    if (!element) {
      return;
    }
    element.textContent = message;
  }

  showError(element, error) {
    if (!element) {
      return;
    }
    element.textContent = 'Error loading alt content: ' + (error?.message || '');
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
