// Main entry point
const initialize = () => {
  // API
  const altContentApi = new AltContentApi();

  // SERVICES
  const conversationProcessingService = new ConversationProcessingService();

  // PRESENTATION HANDLERS
  const loadingIndicator = new LoadingIndicator();
  const summaryIndicator = new SummaryIndicator();
  const chatInterface = new ChatInterface(conversationProcessingService);
  const domModifier = new DomModifier();

  // EXTERNAL LIBS
  const wcagCheck = axe;
  const adBlock = new AdBlock();
  for (const rule of baseAdBlockRules) {
    adBlock.parse(rule);
  }

  // SERVICES
  const domProcessingService = new DomProcessingService();
  const imageParsingService = new ImageParsingService(altContentApi, domModifier);

  // ORCHESTRATION
  const processPageUseCase = new ProcessPageUseCase(
    domProcessingService,
    altContentApi,
    loadingIndicator,
    domModifier,
    imageParsingService,
    summaryIndicator,
    chatInterface,
    adBlock,
    wcagCheck
  );

  processPageUseCase.execute(document);
};

initialize();
