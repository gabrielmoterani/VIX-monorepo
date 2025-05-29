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
    wcagCheck,
    readability
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
    this.readability = readability;
  }
  
  summary = '';
  htmlContent = '';
  actions = [];

  async execute(document) {
    // DISPLAY LOADING INDICATOR
    const loadingDiv = this.loadingIndicator.show();
    const auxiliaryDocument = document.cloneNode(true);
    const parsedDocument = new DOMParser().parseFromString(new Readability(auxiliaryDocument).parse().content, 'text/html');
   
    const cleanedDocumentJson = this.domProcessingService.processDom(parsedDocument.body);
    const pageJson = this.domProcessingService.processDom(document.body);


    // RETRIEVE TEXT AND IMAGES IN JSON FORMAT
    const texts = this.domProcessingService.retrieveTexts(pageJson).join(' ');
    const cleanedTexts = this.domProcessingService.retrieveTexts(cleanedDocumentJson).join(' ');
    const tokenOriginalEstimation = texts.length/4;
    const tokenParsedEstimation = cleanedTexts.length/4;


    const images = this.domProcessingService.retrieveImages(pageJson);
    const imagesAltCounter = images.reduce((acc, image) => {
      const imageElement = document.querySelector(`[data-vix="${image.attributes["data-vix"]}"]`);
      const alt = imageElement ? imageElement.attributes.alt : null;
      if (alt) {
        acc["altCounter"] = (acc["altCounter"] || 0) + 1;
      }

      if ( alt && alt.length > 240) {
        acc["altMeaningfulCounter"] = (acc["altMeaningfulCounter"] || 0) + 1;
      }

      if (!alt) {
        acc["altMissingCounter"] = (acc["altMissingCounter"] || 0) + 1;
      }

      return acc;
    }, {altCounter: 0, altMeaningfulCounter: 0, altMissingCounter: 0});
    const filteredImages = images.filter((image) => {
      if (!image.attributes.src) return false;
      return !this.adBlock.matches(image.attributes.src);
    });

    const actionElements = this.domProcessingService.retrieveActionElements(pageJson);

    // QUERY WCAG CONTEXT
    const wcagTest = await this.wcagCheck.run();

    console.log("VIX STATISTICS", {
      htmlSize: document.body.outerHTML.length,
      parsedHtmlSize: parsedDocument.body.outerHTML.length,
      jsonSize: JSON.stringify(pageJson).length,
      cleanedJsonSize: JSON.stringify(cleanedDocumentJson).length,
      textsSize: texts.length,
      cleanedTextsSize: cleanedTexts.length,
      filteredAddImages: images.length - filteredImages.length,
      imagesCount: images.length,
      ...imagesAltCounter,
      filteredImagesSize: filteredImages.length,
      actionElementsSize: actionElements.length,
      tokenEstimationInOriginal: tokenOriginalEstimation,
      tokenEstimationInParsed: tokenParsedEstimation,
      tokenEstimationFullHTML: (document.body.outerHTML.length/4),
      elementsCount: this.domProcessingService.countElements(pageJson),
      wcagViolations: wcagTest.inapplicable.length + wcagTest.incomplete.length,
      GPT_MINI_0: tokenParsedEstimation < 16000,
      GPT_4_1: tokenParsedEstimation < 32000,
      GPT_o3_mini: tokenParsedEstimation < 100000,
      Claude_3_5_Sonnet: tokenParsedEstimation < 20000,
      DeepSeek_R1: tokenParsedEstimation < 64000,
    })

    try {
      const now = new Date();
      //LOAD SUMMARY
      this.loadingIndicator.updateStatus(loadingDiv, 'Loading summary');
      let auxTexts = texts;
      const tokenLimit = 25000;
      
      // More accurate token estimation (roughly 4 characters per token)
      const estimateTokens = (text) => Math.ceil(text.length / 4);
      
      // Smart text truncation that preserves important content
      const truncateText = (text, maxTokens) => {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        let truncatedText = '';
        let currentTokens = 0;
        
        for (const sentence of sentences) {
          const sentenceTokens = estimateTokens(sentence);
          if (currentTokens + sentenceTokens > maxTokens) {
            break;
          }
          truncatedText += sentence + '. ';
          currentTokens += sentenceTokens;
        }
        
        return truncatedText.trim();
      };

      const originalTokens = estimateTokens(texts);
      const cleanedTokens = estimateTokens(cleanedTexts);

      if (originalTokens > tokenLimit) {
        auxTexts = cleanedTexts;
        if (cleanedTokens > tokenLimit) {
          // Use smart truncation instead of arbitrary word limit
          auxTexts = truncateText(cleanedTexts, tokenLimit);
          console.log("VIX: Text truncated to", estimateTokens(auxTexts), "tokens");
        }
      }
      

      const { response: summary } = await this.altContentApi.requestSummary(auxTexts, "o4-mini");
      const summaryTime = new Date() - now;

      this.summary = summary;
      this.htmlContent = pageJson;
      this.actions = actionElements;

      this.chatInterface.show();
      this.summaryIndicator.show(summary);
      this.loadingIndicator.updateStatus(loadingDiv, 'Loading additional images context');

      const startImagesTime = new Date();
      // QUERY ADDITIONAL IMAGES
     this.imageParsingService.execute(filteredImages, summary, "o4-mini").then(({success: imagesSuccess, imagesTime: imagesTime}) => {
        this.loadingIndicator.updateStatus(
          loadingDiv,
          `Added additional alternative text to ${imagesSuccess} images`
        );
        const allImagesTime = new Date() - startImagesTime;
        console.log("VIX: TIMES FOR PROCESSING PAGE", {
          summaryTime: `${summaryTime / 1000}s`,
          allImagesTime: `${allImagesTime / 1000}s`,
          imagesSuccess,
          imagesTime: `${imagesTime / 1000}s`,
          imagesTimePerImage: `${(imagesTime / imagesSuccess) / 1000}s`,
          imagesAvarageTime: `${(imagesTime / imagesSuccess) / 1000}s`,
        })
        this.loadingIndicator.fadeOut(loadingDiv);
    });


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
      // this.loadingIndicator.fadeOut(loadingDiv);
      return this; // Return this instance to allow chaining
    } catch (error) {
      console.error('Error processing page:', error);
      this.loadingIndicator.showError(loadingDiv, error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }

  extractAltContentElements(data) {
    return data.elements || [];
  }
}
