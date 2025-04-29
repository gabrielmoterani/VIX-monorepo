class ImageParsingService {
  constructor(altContentApi, domModifier) {
    this.altContentApi = altContentApi;
    this.domModifier = domModifier;
  }

  async execute(imageNodes, summary) {
    let success = 0;
    const imageUrls = this.extractImageUrls(imageNodes);
    for (const { url, id } of imageUrls) {
      try {
        const { response } = await this.requestImageAltText(url, summary);
        // await this.addAltContentBelowImage(id, response);
        this.domModifier.queueModification(id, 'alt', `VIX: ${response}`);
        this.domModifier.applyQueuedModifications();
        success++;
      } catch (error) {
        console.log('Error processing image:', error);
      }
    }
    return success;
  }

  extractImageUrls(imageNodes) {
    const imageUrls = imageNodes.map((node) => ({
      url: node.attributes.src,
      id: node.attributes['data-vix'],
    }));
    return imageUrls;
  }

  async requestImageAltText(imageUrl, summary) {
    const altText = await this.altContentApi.requestImageAltText(imageUrl, summary);
    return altText;
  }

  // async addAltContentBelowImage(id, altText) {
  //   const image = document.querySelector(`[data-vix="${id}"]`);
  //   if (image) {
  //     await this.addAltContentBelowImageElement(image, altText);
  //   } else {
  //     console.warn(`Image with URL ${id} not found in the document`);
  //   }
  // }

  // async addAltContentBelowImageElement(image, altText) {
  //   const altDiv = document.createElement('div');
  //   altDiv.className = 'vix-alt-content';
  //   altDiv.textContent = altText;

  //   // Style the alt content div
  //   altDiv.style.backgroundColor = '#000';
  //   altDiv.style.border = '1px solid #dee2e6';
  //   altDiv.style.borderRadius = '4px';
  //   altDiv.style.padding = '8px 12px';
  //   altDiv.style.margin = '8px 0';
  //   altDiv.style.fontSize = '14px';
  //   altDiv.style.color = '#fff';
  //   altDiv.style.maxWidth = image.width + 'px'; // Match image width
  //   altDiv.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';

  //   // Insert after the image
  //   image.parentNode.insertAfter(altDiv, image.nextSibling);
  // }
}
