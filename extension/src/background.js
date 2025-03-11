const initialize = () => {
    const browserEventHandler = new BrowserEventHandler(processPageUseCase);
    browserEventHandler.setupEventListeners();
};

initialize();
