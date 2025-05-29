class ContentAPI {
  constructor(API_URL) {
    this.API_URL = API_URL;
  }

  _handleNetworkError(error, operation, context = {}) {
    let errorType = 'Unknown error';
    let errorDetails = '';

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      if (error.message.includes('Failed to fetch')) {
        errorType = 'NetworkError';
        errorDetails = 'Unable to reach the server. Please check your internet connection and server availability.';
      } else if (error.message.includes('CORS')) {
        errorType = 'CORS Error';
        errorDetails = 'Cross-Origin Request Blocked. The server needs to allow requests from this origin.';
      }
    } else if (error.name === 'AbortError') {
      errorType = 'RequestTimeout';
      errorDetails = 'The request took too long and was aborted.';
    }

    const errorInfo = {
      type: errorType,
      message: error.message,
      details: errorDetails,
      operation,
      timestamp: new Date().toISOString(),
      ...context
    };

    console.error(`${operation} failed:`, errorInfo);
    throw new Error(`${operation} failed: ${errorType} - ${errorDetails}`);
  }

  async requestImageAltText(imageUrl, summary, model) {
    const timenow = +new Date();
    try {
      // console.log('!!!!!!!', imageUrl, summary);
      const response = await fetch(`${this.API_URL}/parse_image`, {
        method: 'POST',
        body: JSON.stringify({ content: { imageUrl, summary } }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to generate image alt text: HTTP ${response.status} - ${response.statusText}\n` +
          `URL: ${this.API_URL}/parse_image\n` +
          `Response: ${errorBody}\n` +
          `Time taken: ${((+new Date()) - timenow) / 1000}s`
        );
      }

      return await response.json();
    } catch (error) {
      return this._handleNetworkError(error, 'Image alt text generation', {
        imageUrl,
        duration: ((+new Date()) - timenow) / 1000
      });
    }
  }

  async requestSummary(texts, model) {
    const timenow = +new Date();
    try {
      const response = await fetch(`${this.API_URL}/summarize_page`, {
        method: 'POST',
        body: JSON.stringify({ content: texts }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to summarize page: HTTP ${response.status} - ${response.statusText}\n` +
          `URL: ${this.API_URL}/summarize_page\n` +
          `Response: ${errorBody}\n` +
          `Time taken: ${((+new Date()) - timenow) / 1000}s`
        );
      }

      return await response.json();
    } catch (error) {
      return this._handleNetworkError(error, 'Page summarization', {
        textLength: texts.length,
        duration: ((+new Date()) - timenow) / 1000
      });
    }
  }

  async requestWCAGCheck(jsonContent) {
    const timenow = +new Date();
    try {
      const response = await fetch(`${this.API_URL}/wcag_check`, {
        method: 'POST',
        body: JSON.stringify({ content: JSON.stringify(jsonContent) }),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to perform WCAG check: HTTP ${response.status} - ${response.statusText}\n` +
          `URL: ${this.API_URL}/wcag_check\n` +
          `Response: ${errorBody}\n` +
          `Time taken: ${((+new Date()) - timenow) / 1000}s`
        );
      }

      return await response.json();
    } catch (error) {
      return this._handleNetworkError(error, 'WCAG check', {
        contentSize: JSON.stringify(jsonContent).length,
        duration: ((+new Date()) - timenow) / 1000
      });
    }
  }
}
