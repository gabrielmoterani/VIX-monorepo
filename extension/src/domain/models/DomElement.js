class DomElement {
  constructor(tag, attributes = {}, children = []) {
    this.tag = tag?.toLowerCase() || null;
    this.attributes = attributes;
    this.children = children;
    this.uniqueId = this.generateUniqueId();
  }

  generateUniqueId() {
    return 'vix-' + Math.random().toString(36).substr(2, 9);
  }

  addGtknAttributes() {
    this.attributes['data-gtkn'] = this.uniqueId;
    if (!this.attributes['id']) {
      this.attributes['id'] = this.uniqueId;
    }
  }

  isSkippableElement() {
    const skippableTags = ['script', 'style', 'svg', 'iframe'];
    return (
      this.tag &&
      (skippableTags.includes(this.tag) ||
        (this.tag === 'link' && this.attributes['rel'] === 'stylesheet'))
    );
  }
}
