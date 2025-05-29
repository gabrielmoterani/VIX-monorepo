class DomModifier {
  constructor() {
    this.modificationQueue = new Map();
  }

  modifyElement(id, attributeName, attributeValue) {
    let element = document.getElementById(id);
    if (!element) {
      element = document.querySelector(`[data-vix="${id}"]`);
    }
    if (!element) {
      console.warn(`Element with id ${id} not found`);
      return false;
    }

    try {
      element.setAttribute(attributeName, attributeValue);
      
      // If we're setting an alt attribute, also create a visible text element
      if (attributeName === 'alt' && element.tagName.toLowerCase() === 'img') {
        // Create a container if it doesn't exist
        let container = element.parentElement;
        if (!container.classList.contains('vix-image-container')) {
          const newContainer = document.createElement('div');
          newContainer.className = 'vix-image-container';
          newContainer.style.position = 'relative';
          newContainer.style.display = 'inline-block';
          element.parentNode.insertBefore(newContainer, element);
          newContainer.appendChild(element);
          container = newContainer;
        }

        // Create or update the alt text element
        let altTextElement = container.querySelector('.vix-alt-text');
        if (!altTextElement) {
          altTextElement = document.createElement('div');
          altTextElement.className = 'vix-alt-text';
          altTextElement.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 4px 8px;
            font-size: 12px;
            text-align: center;
          `;
          container.appendChild(altTextElement);
        }

        altTextElement.textContent = attributeValue;
        
        // Remove hover event listeners since text is always visible
      }
      
      return true;
    } catch (error) {
      console.error(`Error modifying element ${id}:`, error);
      return false;
    }
  }

  queueModification(id, attributeName, attributeValue) {
    if (!this.modificationQueue.has(id)) {
      this.modificationQueue.set(id, new Map());
    }
    this.modificationQueue.get(id).set(attributeName, attributeValue);
  }

  applyQueuedModifications() {
    for (const [id, attributes] of this.modificationQueue) {
      for (const [attributeName, attributeValue] of attributes) {
        this.modifyElement(id, attributeName, attributeValue);
      }
    }
    this.modificationQueue.clear();
  }
}
