class TaskAPI {
    constructor(API_URL, summary, htmlContent) {
        this.API_URL = API_URL;
        this.summary = summary;
        this.htmlContent = htmlContent;
    }
    async requestPageTask(taskPrompt) {
      const timenow = +new Date();
      try {
        const response = await fetch(`${this.API_URL}/execute_page_task`, {
          method: 'POST',
          body: JSON.stringify({ 
              html_content: this.htmlContent, 
              task_prompt: taskPrompt, 
              page_summary: this.summary 
          }),  
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
  
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(
            `HTTP error ${`${this.API_URL}/execute_page_task`}! status: ${response.status}, body: ${errorBody}, time:${(timenow - +new Date()) / 1000}s`
          );
        }
  
        return await response.json();
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        throw error;
      }
    }
  }
  