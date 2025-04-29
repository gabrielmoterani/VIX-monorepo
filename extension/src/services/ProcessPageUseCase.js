class ProcessPageUseCase {
  constructor(
    domProcessingService,
    altContentApi,
    loadingIndicator,
    domModifier,
    imageParsingService,
    summaryIndicator,
    chatInterface,
    adBlock,
    wcagCheck
  ) {
    this.domProcessingService = domProcessingService;
    this.altContentApi = altContentApi;
    this.loadingIndicator = loadingIndicator;
    this.domModifier = domModifier;
    this.imageParsingService = imageParsingService;
    this.summaryIndicator = summaryIndicator;
    this.adBlock = adBlock;
    this.wcagCheck = wcagCheck;
    this.chatInterface = chatInterface;
  }

  async execute(document) {
    // DISPLAY LOADING INDICATOR
    const loadingDiv = this.loadingIndicator.show();
    this.chatInterface.show();
    // PROCESS DOM
    const pageJson = this.domProcessingService.processDom(document.body);

    // RETRIEVE TEXT AND IMAGES IN JSON FORMAT
    const texts = this.domProcessingService.retrieveTexts(pageJson).join(' ');
    const images = this.domProcessingService.retrieveImages(pageJson).filter((image) => {
      // FILTER OUT AD BLOCKED ELEMENTS
      if (!image.attributes.src) return false;
      return !this.adBlock.matches(image.attributes.src);
    });

    try {
      // LOAD SUMMARY
      this.loadingIndicator.updateStatus(loadingDiv, 'Loading summary');
      const { response: summary } = await this.altContentApi.requestSummary(texts);
      this.summaryIndicator.show(summary);
      this.loadingIndicator.updateStatus(loadingDiv, 'Loading additional images context');

      // // QUERY ADDITIONAL IMAGES
      // const imagesSuccess = await this.imageParsingService.execute(images, summary);
      // this.loadingIndicator.updateStatus(
      //   loadingDiv,
      //   `Added additional alternative images to ${imagesSuccess} images`
      // );
      // this.loadingIndicator.updateStatus(loadingDiv, 'Loading WCAG context');

      // // QUERY WCAG CONTEXT
      // const wcagTest = await this.wcagCheck.run();
      // const wcagViolations = wcagTest.violations;
      // console.log(wcagViolations);

      // // USE LLM TO GENERATE WCAG MISSING CONTEXT
      // const { response: wcagCheckResponse } = await this.altContentApi.requestWCAGCheck(pageJson);
      // if (!wcagCheckResponse.startsWith('Error')) {
      //   const wcagCheckElements = this.extractAltContentElements(JSON.parse(wcagCheckResponse));

      //   for (const element of wcagCheckElements) {
      //     for (const attribute of element.addAttributes) {
      //       try {
      //         this.domModifier.modifyElement(element.id, attribute.attributeName, attribute.value);
      //       } catch (error) {
      //         console.error('Error modifying element:', error);
      //       }
      //     }
      //   }
      //   this.domModifier.applyQueuedModifications();
      //   this.loadingIndicator.updateStatus(
      //     loadingDiv,
      //     `Added WCAG context to ${wcagCheckElements.length} elements`
      //   );

      //   // FINISH ADAPTING PAGE
      // } else {
      //   this.loadingIndicator.updateStatus(loadingDiv, 'Error loading WCAG context');
      // }
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
