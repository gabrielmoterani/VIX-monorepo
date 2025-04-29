class AltContentApi {
  constructor() {
    // this.API_URL = 'http://localhost:5002/api';
    this.API_URL = 'https://vix-monorepo.fly.dev/api';
  }

  async requestImageAltText(imageUrl, summary) {
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
          `HTTP error ${`${this.API_URL}/parse_image`}! status: ${response.status}, body: ${errorBody}, time:${(timenow - +new Date()) / 1000}s`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
  }

  async requestSummary(texts) {
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
          `HTTP error ${`${this.API_URL}/summarize_page`}! status: ${response.status}, body: ${errorBody}, time:${(timenow - +new Date()) / 1000}s`
        );
      }

      return await response.json();
    } catch (error) {
      console.log('!!!!!!!', error);
      console.error('There was a problem with the fetch operation:', error);
      throw error;
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
          `HTTP error ${`${this.API_URL}/summarize_page`}! status: ${response.status}, body: ${errorBody}, time:${(timenow - +new Date()) / 1000}s`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
  }
}
