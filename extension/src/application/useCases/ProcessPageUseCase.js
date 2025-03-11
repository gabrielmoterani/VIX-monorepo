class ProcessPageUseCase {
  constructor(
    domProcessingService,
    altContentApi,
    loadingIndicator,
    domModifier,
    imageParsingService,
    summaryIndicator
  ) {
    this.domProcessingService = domProcessingService;
    this.altContentApi = altContentApi;
    this.loadingIndicator = loadingIndicator;
    this.domModifier = domModifier;
    this.imageParsingService = imageParsingService;
    this.summaryIndicator = summaryIndicator;
  }

  async execute(document) {
    const loadingDiv = this.loadingIndicator.show();
    const pageJson = this.domProcessingService.processDom(document.body);
    const texts = this.domProcessingService.retrieveTexts(pageJson).join(' ');
    const images = this.domProcessingService.retrieveImages(pageJson);

    try {
      this.loadingIndicator.updateStatus(loadingDiv, 'Loading summary');
      const { response: summary } = await this.altContentApi.requestSummary(texts);
      this.summaryIndicator.show(summary);
      this.loadingIndicator.updateStatus(loadingDiv, 'Loading additional images context');
      const imagesSuccess = await this.imageParsingService.execute(images, summary);
      this.loadingIndicator.updateStatus(
        loadingDiv,
        `Added additional alternative images to ${imagesSuccess} images`
      );
      this.loadingIndicator.updateStatus(loadingDiv, 'Loading WCAG context');
      const { response: wcagCheck } = await this.altContentApi.requestWCAGCheck(pageJson);
      const wcagCheckElements = this.extractAltContentElements(JSON.parse(wcagCheck));

      for (const element of wcagCheckElements) {
        for (const attribute of element.addAttributes) {
          try {
            this.domModifier.modifyElement(element.id, attribute.attributeName, attribute.value);
          } catch (error) {
            console.error('Error modifying element:', error);
          }
        }
      }
      this.domModifier.applyQueuedModifications();

      this.loadingIndicator.updateStatus(
        loadingDiv,
        `Added WCAG context to ${wcagCheckElements.length} elements`
      );

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
