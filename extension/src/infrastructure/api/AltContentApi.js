class AltContentApi {
  constructor() {
    this.API_URL = 'https://11uhx8j6hf.execute-api.us-east-1.amazonaws.com/default/GTKN-Lambda';
  }

  async requestAltContent(pageJson) {
    const timenow = +new Date();
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        body: JSON.stringify(pageJson),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, body: ${errorBody}, time:${(timenow - +new Date()) / 1000}s`
        );
      }

      return await response.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
  }
}
