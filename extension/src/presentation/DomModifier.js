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
