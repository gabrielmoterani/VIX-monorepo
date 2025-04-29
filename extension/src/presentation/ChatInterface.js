class ChatInterface {
  constructor(conversationProcessingService) {
    this.chatContainer = null;
    this.inputField = null;
    this.sendButton = null;
    this.statusMessage = null;
    this.conversationProcessingService = conversationProcessingService;
  }

  show() {
    if (document.getElementById('vix-chat-interface')) {
      return;
    }

    // Create main container
    const chatDiv = document.createElement('div');
    chatDiv.id = 'vix-chat-interface';
    chatDiv.setAttribute('role', 'region');
    chatDiv.setAttribute('aria-label', 'AI Assistant Chat Interface');

    // Style the container
    chatDiv.style.position = 'relative';
    chatDiv.style.width = '100%';
    chatDiv.style.backgroundColor = '#ffffff';
    chatDiv.style.padding = '15px 20px';
    chatDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    chatDiv.style.display = 'flex';
    chatDiv.style.flexDirection = 'column';
    chatDiv.style.gap = '10px';
    chatDiv.style.fontFamily = 'Arial, sans-serif';

    // Create instructions for screen readers
    const instructions = document.createElement('div');
    instructions.id = 'vix-chat-instructions';
    instructions.setAttribute('role', 'status');
    instructions.setAttribute('aria-live', 'polite');
    instructions.textContent = 'VIX AI Assistant';
    instructions.style.color = '#666';
    instructions.style.fontSize = '14px';
    instructions.style.marginBottom = '10px';
    chatDiv.appendChild(instructions);

    // Create input container for better layout
    const inputContainer = document.createElement('div');
    inputContainer.style.display = 'flex';
    inputContainer.style.gap = '10px';
    inputContainer.style.alignItems = 'center';

    // Create input field
    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'vix-chat-input';
    input.setAttribute('aria-label', 'Type your request here');
    input.setAttribute('role', 'textbox');
    input.placeholder = 'Example: "Read the main content of this page" or "Summarize this article"';
    input.style.flex = '1';
    input.style.padding = '12px';
    input.style.border = '2px solid #4CAF50';
    input.style.borderRadius = '4px';
    input.style.fontSize = '16px';
    input.style.minHeight = '44px'; // Minimum touch target size
    this.inputField = input;

    // Create send button
    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.id = 'vix-chat-send';
    sendButton.setAttribute('aria-label', 'Send message');
    sendButton.style.padding = '12px 24px';
    sendButton.style.backgroundColor = '#4CAF50';
    sendButton.style.color = 'white';
    sendButton.style.border = 'none';
    sendButton.style.borderRadius = '4px';
    sendButton.style.cursor = 'pointer';
    sendButton.style.fontSize = '16px';
    sendButton.style.minHeight = '44px'; // Minimum touch target size
    sendButton.style.minWidth = '44px'; // Minimum touch target size
    this.sendButton = sendButton;

    // Create status message area
    const statusMessage = document.createElement('div');
    statusMessage.id = 'vix-chat-status';
    statusMessage.setAttribute('role', 'status');
    statusMessage.setAttribute('aria-live', 'polite');
    statusMessage.style.color = '#666';
    statusMessage.style.fontSize = '14px';
    statusMessage.style.marginTop = '10px';
    this.statusMessage = statusMessage;

    // Add elements to containers
    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    chatDiv.appendChild(inputContainer);
    chatDiv.appendChild(statusMessage);

    // Add to page
    document.body.insertBefore(chatDiv, document.body.firstChild);
    this.chatContainer = chatDiv;

    // Add event listeners
    this.setupEventListeners();

    // Focus the input field
    input.focus();

    return chatDiv;
  }

  setupEventListeners() {
    // Handle send button click
    this.sendButton.addEventListener('click', () => {
      this.handleSendMessage();
    });

    // Handle enter key press
    this.inputField.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        this.handleSendMessage();
      }
    });

    // Handle focus events for better screen reader experience
    this.inputField.addEventListener('focus', () => {
      this.updateStatus('Input field focused. Type your request and press Enter to send.');
    });

    this.sendButton.addEventListener('focus', () => {
      this.updateStatus('Send button focused. Press Enter to send your message.');
    });
  }

  updateStatus(message) {
    if (this.statusMessage) {
      this.statusMessage.textContent = message;
    }
  }

  handleAddResponse(response) {
    console.log('Response:', response);
  }

  handleSendMessage() {
    const message = this.inputField.value.trim();
    if (message) {
      this.updateStatus('Processing your request...');
      // TODO: Implement message handling logic
      this.conversationProcessingService.addMessage(
        {
          role: 'user',
          direction: 'out',
          content: message,
        },
        this.handleAddResponse
      );
      this.inputField.value = '';
      this.inputField.focus(); // Return focus to input after sending
    }
  }

  remove() {
    if (this.chatContainer) {
      this.chatContainer.remove();
      this.chatContainer = null;
      this.inputField = null;
      this.sendButton = null;
      this.statusMessage = null;
    }
  }
}
