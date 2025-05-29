// Main entry point
const initialize = () => {
  // API
  const mainAPI = new MainAPI();
  const contentApi = new ContentAPI(mainAPI.API_URL);

  // PRESENTATION HANDLERS
  const loadingIndicator = new LoadingIndicator();
  const summaryIndicator = new SummaryIndicator();
  const domModifier = new DomModifier();

  // SERVICES
  const domProcessingService = new DomProcessingService();
  const imageParsingService = new ImageParsingService(contentApi, domModifier);
  const taskApi = new TaskAPI(mainAPI.API_URL);
  const conversationProcessingService = new ConversationProcessingService(taskApi);
  const chatInterface = new ChatInterface(conversationProcessingService);

  // EXTERNAL LIBS
  const wcagCheck = axe;
  const adBlock = new AdBlock();
  for (const rule of baseAdBlockRules) {
    adBlock.parse(rule);
  }

  // ORCHESTRATION
  const processPageUseCase = new ProcessPageUseCase(
    domProcessingService,
    contentApi,
    loadingIndicator,
    domModifier,
    imageParsingService,
    summaryIndicator,
    chatInterface,
    adBlock,
    wcagCheck
  );

  processPageUseCase.execute(document).then(() => {
    // Update conversationProcessingService with summary and HTML content
    conversationProcessingService.updatePageData(
      processPageUseCase.summary,
      processPageUseCase.htmlContent,
      processPageUseCase.actions
    );
  });
};

initialize();
