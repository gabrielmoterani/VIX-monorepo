// Main entry point
const initialize = () => {
  const domProcessingService = new DomProcessingService();
  const altContentApi = new AltContentApi();
  const loadingIndicator = new LoadingIndicator();
  const domModifier = new DomModifier();

  const processPageUseCase = new ProcessPageUseCase(
    domProcessingService,
    altContentApi,
    loadingIndicator,
    domModifier
  );

  processPageUseCase.execute(document);
};

initialize();
