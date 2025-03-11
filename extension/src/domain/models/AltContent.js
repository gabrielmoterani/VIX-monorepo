class AltContent {
  constructor(id, alt, tag, originalAttributes = {}) {
    this.id = id;
    this.alt = alt;
    this.tag = tag;
    this.originalAttributes = originalAttributes;
  }

  getDisplayText() {
    return 'Added with AI: ' + this.alt;
  }

  static fromApiResponse(element) {
    return new AltContent(element.id, element.alt, element.tag, element.attributes);
  }
};
