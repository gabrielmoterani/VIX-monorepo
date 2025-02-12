function isLocalUrl(url) {
  return url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
}

let domToJson = (node) => {
  if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node.tagName.toLowerCase() === 'script' ||
       node.tagName.toLowerCase() === 'style' ||
       node.tagName.toLowerCase() === 'svg' ||
       node.tagName.toLowerCase() === 'iframe' ||
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
    let uniqueId = node.id || ('gtkn-' + Math.random().toString(36).substr(2, 9));
    
    node.setAttribute('data-gtkn', uniqueId);
    obj.attributes['data-gtkn'] = uniqueId;

    if (!node.id) {
      node.id = uniqueId;
      obj.attributes['id'] = uniqueId;
    }

    // Check for divs with background images
    if (node.tagName.toLowerCase() === 'div' && window.getComputedStyle(node).backgroundImage !== 'none') {
      const backgroundImage = window.getComputedStyle(node).backgroundImage;
      let url = backgroundImage.slice(5, -2) || '';
      if(node.attributes['nitro-lazy-bg']) {
        url = node.attributes['nitro-lazy-bg']['nodeValue']
      }
      if((url.includes('image') || url.includes('http') || url.includes('jpg') || url.includes('png')) && !attr.value.includes('gif')){
        obj['tag'] = 'img'
        obj['attributes']['src'] = url
      }
    }
  }

  if (node.attributes) {
    for (let attr of node.attributes) {
      if (attr.name === 'src' && isLocalUrl(attr.value)) {
        obj.attributes[attr.name] = window.location.origin + attr.value;
      }else if(attr.name.includes('src') && !attr.value.includes('svg') && !attr.value.includes('gif')){
        obj.attributes['src'] = attr.value;
      } else if(attr.name === 'src') {
        continue;
      }
      else {
        obj.attributes[attr.name] = attr.value;
      }
    }
    delete obj.attributes['alt'];
  }

  for (let child of node.childNodes) {
    const childJson = domToJson(child);
    if (childJson) {
      obj.children.push(childJson);
    }
  }


  return obj;
};
