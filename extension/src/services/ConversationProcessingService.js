class ConversationProcessingService {
  constructor() {
    this.conversation = [];
  }

  addMessage(message, callback) {
    this.conversation.push(message);
    console.log('Conversation:', 'OLHA A MENSAGEM', message);
    callback('RECEBIDO');
  }

  getConversation() {
    return this.conversation;
  }

  clearConversation() {
    this.conversation = [];
  }
}
