const API_URL = "https://11uhx8j6hf.execute-api.us-east-1.amazonaws.com/default/GTKN-Lambda"

let requireRequestToAltServer = (pageJson) => {
    return new Promise((resolve) => {
        (chrome || browser).runtime.sendMessage({
            action: 'requestAltContent',
            pageJson: pageJson
        }, response => {
            if (response.success) {
                resolve(response.data)
            } else {
                console.error('Errorzim:', response.error);
            }
        });
    })
}

let findElement = (element) => {
    if (element.id && element.id !== "") {
        return document.getElementById(element.id);
    }
    
    let selector = [];
    if (element.tag) selector.push(element.tag);
    if (element.class) selector.push(`.${element.class.split(' ').join('.')}`);
    if (element.src) selector.push(`[src="${element.src}"]`);
    if (element.type) selector.push(`[type="${element.type}"]`);
    return document.querySelector(selector.join(''));
}

let retrieveElementsToChangeContent = (data) => {
    return data.elements || []
}

let findByIdOrContentAndSubstituteAltContent = (elements) => {
    elements.forEach(element => {
        let elementToChange = findElement(element);
        console.log("el", elementToChange)
        if (elementToChange) {
            elementToChange.alt = "Added with AI:"+ element.alt
        }
    })
}

let createLoadingMessageDiv = () => {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'alt-content-loading';
    loadingDiv.textContent = 'Loading Alt Content';
    document.body.insertBefore(loadingDiv, document.body.firstChild);
    return loadingDiv;
}


let changeDivText = (element, textContent) => {
    element.textContent = textContent
}

let fadeOutElement = (element) => {
    element.style.transition = 'opacity 1s';
        setTimeout(() => {
        element.style.opacity = '0';
        setTimeout(() => {
            element.remove();
        }, 1000);
    }, 9000);
}