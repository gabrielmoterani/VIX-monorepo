class BrowserEventHandler {
  constructor(processPageUseCase) {
    this.processPageUseCase = processPageUseCase;
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('load', () => this.handleLoad());
    document.addEventListener('DOMContentLoaded', () => {
      if (!window.loadHandlerCalled) {
        this.handleLoad();
      }
    });

    if (document.readyState === 'complete') {
      this.handleLoad();
    }
  }

  async handleLoad() {
    if (window.loadHandlerCalled) return;
    window.loadHandlerCalled = true;
    await this.processPageUseCase.execute(document);
  }
}
