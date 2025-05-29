class ConversationProcessingService {
  constructor(contentApi) {
    this.conversation = [];
    this.contentApi = contentApi;
    this.summary = '';
    this.htmlContent = '';
  }

  async addMessage(message, callback) {
    this.conversation.push(message);
    if (message.direction === 'out') {
      const response = await this.executePrompt(message.content);
      if(response.js_commands) {
        await this.executeJsCommands(response.js_commands);
      }
      if(response.explanation) {
        const assistantMessage = {
          direction: 'in',
          content: response.explanation
        };
        this.conversation.push(assistantMessage);
        callback(this.conversation);
      }
    }
  }

  async executePrompt(taskPrompt) {
    const response = await this.contentApi.requestPageTask(taskPrompt);
    
    // Parse the response to extract only explanation and js_commands
    try {
      // The response.response is a JSON string, so we need to parse it
      const parsedResponse = JSON.parse(response.response);
      
      console.log('PARSED RESPONSE', parsedResponse);
      // Return only the explanation and js_commands
      return {
        explanation: parsedResponse.explanation,
        js_commands: parsedResponse.js_commands
      };
    } catch (error) {
      console.error('Error parsing response:', error);
      return {
        explanation: 'Error parsing response',
        js_commands: []
      };
    }
  }

  async executeJsCommands(jsCommands) {
    for (const command of jsCommands) {
      try {
        await new Function(command)();
      } catch (error) {
        console.error('Error executing command:', error);
      }
    }
  }

  getConversation() {
    return this.conversation;
  }

  clearConversation() {
    this.conversation = [];
  }
  
  updatePageData(summary, htmlContent) {
    this.summary = summary;
    this.htmlContent = htmlContent;
    this.contentApi.summary = summary;
    this.contentApi.htmlContent = htmlContent;
    this.contentApi.actions = actions;
  }
}
