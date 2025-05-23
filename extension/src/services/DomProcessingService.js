class DomProcessingService {
  constructor() {
    this.origin = window.location.origin;
  }

  processDom(node) {
    // Skip if node is null or is a comment node
    if (!node || node.nodeType === Node.COMMENT_NODE) {
      return null;
    }

    // Handle text nodes
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        return { type: 'text', text: text };
      }
      return null;
    }

    // Skip certain elements
    if (this.isSkippableElement(node)) {
      return null;
    }

    // Create element object
    const element = {
      tag: node.tagName ? node.tagName.toLowerCase() : null,
      attributes: this.processAttributes(node),
      children: [],
      text: node.textContent ? node.textContent.trim() : '',
    };

    // Add GTKN identifier
    const uniqueId = `vix-${Math.random().toString(36).substr(2, 9)}`;
    element.attributes['data-vix'] = uniqueId;
    node.setAttribute('data-vix', uniqueId);

    if (!node.attributes.id) {
      element.attributes.id = uniqueId;
    }

    // Process background images for divs
    if (node.tagName?.toLowerCase() === 'div') {
      const computedStyle = window.getComputedStyle(node);
      if (computedStyle.backgroundImage !== 'none') {
        this.processBackgroundImage(element, node, computedStyle);
      }
    }

    // Process children
    if (node.childNodes) {
      for (const child of node.childNodes) {
        const processedChild = this.processDom(child);
        if (processedChild) {
          element.children.push(processedChild);
        }
      }
    }

    return element;
  }

  isSkippableElement(node) {
    const skippableTags = ['script', 'style', 'svg', 'iframe'];
    const tag = node.tagName?.toLowerCase();
    return tag && (skippableTags.includes(tag) || (tag === 'link' && node.rel === 'stylesheet'));
  }

  processAttributes(node) {
    const attributes = {};

    if (!node.attributes) {
      return attributes;
    }

    for (const attr of node.attributes) {
      // Skip alt attributes as they will be processed separately
      if (attr.name === 'alt') {
        continue;
      }

      // Handle src attributes
      if (attr.name === 'src') {
        attributes[attr.name] = this.processUrl(attr.value);
      } else if (
        attr.name.includes('src') &&
        !attr.value.includes('svg') &&
        !attr.value.includes('gif')
      ) {
        attributes.src = this.processUrl(attr.value);
      } else {
        attributes[attr.name] = attr.value;
      }
    }

    return attributes;
  }

  processUrl(url) {
    if (this.isLocalUrl(url)) {
      return this.origin + url;
    }
    return url;
  }

  isLocalUrl(url) {
    return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
  }

  processBackgroundImage(element, node, computedStyle) {
    const backgroundImage = computedStyle.backgroundImage;
    let url = backgroundImage.slice(5, -2) || '';

    // Handle Nitro lazy loading
    if (node.attributes['nitro-lazy-bg']) {
      url = node.attributes['nitro-lazy-bg'].value;
    }

    if (this.isValidImageUrl(url)) {
      element.tag = 'img';
      element.attributes.src = this.processUrl(url);
    }
  }

  isValidImageUrl(url) {
    return (
      (url.includes('image') ||
        url.includes('http') ||
        url.includes('jpg') ||
        url.includes('png')) &&
      !url.includes('gif')
    );
  }

  retrieveImages(node) {
    const images = [];

    // If node is an object with a tag property (from processDom output)
    if (node && typeof node === 'object') {
      // Check if this is an image element
      if (node.tag === 'img') {
        images.push(node);
      }

      // Recursively process children if they exist
      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          const childImages = this.retrieveImages(child);
          images.push(...childImages);
        }
      }
    }

    return images;
  }

  retrieveTexts(node) {
    const texts = [];

    // If node is null, return empty array
    if (!node) {
      return [];
    }

    // Handle text nodes
    if (node.type === 'text') {
      return [node.text];
    }

    // If this is an element node with text content
    // biome-ignore lint/complexity/useOptionalChain: No need to use optional chain here
    if (node.text && node.text.trim()) {
      texts.push(node.text);
    }

    // Recursively process children if they exist
    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        const childTexts = this.retrieveTexts(child);
        texts.push(...childTexts);
      }
    }

    return texts;
  }

  processHTML(node) {
    return node.outerHTML || node.innerHTML || '';
  }
}
