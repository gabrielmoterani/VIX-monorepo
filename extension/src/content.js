// Main entry point
const initialize = () => {
  const domProcessingService = new DomProcessingService();
  const altContentApi = new AltContentApi();
  const loadingIndicator = new LoadingIndicator();
  const summaryIndicator = new SummaryIndicator();
  const domModifier = new DomModifier();
  const imageParsingService = new ImageParsingService(
    altContentApi,
    domModifier
  );

  const processPageUseCase = new ProcessPageUseCase(
    domProcessingService,
    altContentApi,
    loadingIndicator,
    domModifier,
    imageParsingService,
    summaryIndicator
  );

  processPageUseCase.execute(document);
};

initialize();
