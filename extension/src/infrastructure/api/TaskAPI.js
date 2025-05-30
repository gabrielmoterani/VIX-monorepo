class TaskAPI {
    constructor(API_URL) {
        this.API_URL = API_URL;
    }
    async requestPageTask(taskPrompt, actions, summary) {
      console.log("VIX: REQUESTING PAGE TASK", actions, summary);
      const timenow = +new Date();
      try {
        const response = await fetch(`${this.API_URL}/execute_page_task`, {
          method: 'POST',
          body: JSON.stringify({ 
              html_content: JSON.stringify(actions), 
              task_prompt: taskPrompt, 
              page_summary: summary,
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
  