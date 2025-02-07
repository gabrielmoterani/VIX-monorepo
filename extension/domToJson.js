
function isLocalUrl(url) {
  return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
}

let domToJson = (node) => {
  if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node.tagName.toLowerCase() === 'script' ||
       node.tagName.toLowerCase() === 'style' ||
       (node.tagName.toLowerCase() === 'link' && node.rel === 'stylesheet'))
  ) {
      return null;
  }

  const obj = {
    tag: node.tagName ? node.tagName.toLowerCase() : null,
    attributes: {},
    children: []
  };

  if (node.nodeType === Node.ELEMENT_NODE) {
    let uniqueId = node.id || ('blind-' + Math.random().toString(36).substr(2, 9));
    
    node.setAttribute('data-blind', uniqueId);
    obj.attributes['data-blind'] = uniqueId;

    if (!node.id) {
      node.id = uniqueId;
      obj.attributes['id'] = uniqueId;
    }
  }

  if (node.attributes) {
    for (let attr of node.attributes) {
      if (attr.name === 'src' && isLocalUrl(attr.value)) {
        obj.attributes[attr.name] = window.location.origin + attr.value;
      } else {
        obj.attributes[attr.name] = attr.value;
    }
  }

  for (let child of node.childNodes) {
    const childJson = domToJson(child);
    if (childJson) {
      obj.children.push(childJson);
    }
  }

  return obj;
}};
