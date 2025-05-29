class DomProcessingService {
  constructor() {
    this.origin = window.location.origin;
  }

  processDom(node) {
    // Skip if node is null or is a comment node
    if (!node || node.nodeType === Node.COMMENT_NODE) {
      return null;
    }

    const isActionElement = this._isActionElement(node);

    // Handle text nodes
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        return { type: 'text', text: text, isActionElement: isActionElement };
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
      isActionElement: isActionElement
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

  retrieveActionElements(node) {
    const actionElements = [];

    const _retrieveActionElements = (node) => {
      const aux = {
        tag: node.tag,
        text: node.text,
        id: node.attributes["data-vix"],
        href: node.attributes.href || undefined,
        type: node.attributes.type || undefined,
        value: node.attributes.value || undefined,
        placeholder: node.attributes.placeholder || undefined,
        ariaLabel: node.attributes["aria-label"] || undefined,
        ariaLabelledby: node.attributes["aria-labelledby"] || undefined,
      }

      return Object.keys(aux).reduce((acc, key) => {
        if (aux[key]) {
          acc[key] = aux[key];
        }
        return acc;
      }, {});
    }

    if (!node) {
      return actionElements;
    }

    if (node.isActionElement) {
      actionElements.push(_retrieveActionElements(node));
    }// Recursively process children if they exist
    else if (Array.isArray(node.children)) {
      for (const child of node.children) {
        const childActionElements = this.retrieveActionElements(child);
        actionElements.push(...childActionElements);
      }
    }

    return actionElements;
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

  _isActionElement(node) {
    const actionTags = [
      'button',
      'a',
      'input',
      'select',
      'textarea',
      'label',
      'form',
      'option',
      'radio',
      'checkbox',
      'submit',
      'reset'
    ];

    
    const tag = node.tagName?.toLowerCase();
    if (!tag) return false;

    // Check if it's a basic action element
    if (actionTags.includes(tag)) return true;

    // Check for input types
    if (tag === 'input') {
      const type = node.getAttribute('type')?.toLowerCase();
      return type && actionTags.includes(type);
    }

    // Check for role attributes
    const role = node.getAttribute('role')?.toLowerCase();
    if (role && ['button', 'link', 'checkbox', 'radio', 'textbox', 'combobox'].includes(role)) {
      return true;
    }

    // Check for click handlers
    if (node.onclick || node.getAttribute('onclick')) return true;

    // Check for common interactive classes/attributes
    const interactiveClasses = ['btn', 'button', 'clickable', 'interactive'];
    const classList = node.className?.toString().toLowerCase() || '';
    if (interactiveClasses.some(cls => classList.includes(cls))) return true;

    return false;
  }

  countElements(node) {
    let count = 0;

    const _counter = (node) => {
      count++;
      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          _counter(child);
        }
      }
    }

    _counter(node);
    return count;
  }
}
