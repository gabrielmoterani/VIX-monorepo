class ProcessPageUseCase {
  constructor(domProcessingService, altContentApi, loadingIndicator, domModifier) {
    this.domProcessingService = domProcessingService;
    this.altContentApi = altContentApi;
    this.loadingIndicator = loadingIndicator;
    this.domModifier = domModifier;
  }

  async execute(document) {
    const loadingDiv = this.loadingIndicator.show();
    const pageJson = this.domProcessingService.processDom(document.body);
    const pageHTML = this.domProcessingService.processHTML(document.body);

    try {
      const altContent = await this.altContentApi.requestAltContent(pageJson);
      const altContentElements = this.extractAltContentElements(altContent);
      altContentElements.forEach((element) => {
        this.domModifier.queueModification(element.id, 'alt', element.alt);
      });
      this.domModifier.applyQueuedModifications();

      this.loadingIndicator.updateStatus(loadingDiv, 'Added additional alt content');
      this.loadingIndicator.fadeOut(loadingDiv);
    } catch (error) {
      console.error('Error processing page:', error);
      this.loadingIndicator.showError(loadingDiv, error);
    }
  }

  extractAltContentElements(data) {
    return data.elements || [];
  }
}
