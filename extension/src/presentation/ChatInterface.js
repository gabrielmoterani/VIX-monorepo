class ChatInterface {
  constructor(conversationProcessingService) {
    this.chatContainer = null;
    this.inputField = null;
    this.sendButton = null;
    this.statusMessage = null;
    this.conversationProcessingService = conversationProcessingService;
    this.isLoading = false;
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

    // Create loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'vix-chat-loading';
    loadingIndicator.style.display = 'none';
    loadingIndicator.style.alignItems = 'center';
    loadingIndicator.style.justifyContent = 'center';
    loadingIndicator.style.marginTop = '10px';
    loadingIndicator.style.color = '#666';
    loadingIndicator.style.fontSize = '14px';
    
    // Create loading spinner
    const spinner = document.createElement('div');
    spinner.style.width = '20px';
    spinner.style.height = '20px';
    spinner.style.border = '3px solid #f3f3f3';
    spinner.style.borderTop = '3px solid #4CAF50';
    spinner.style.borderRadius = '50%';
    spinner.style.marginRight = '10px';
    spinner.style.animation = 'spin 1s linear infinite';
    
    // Add keyframes for spinner animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
    
    // Create loading text
    const loadingText = document.createElement('span');
    loadingText.textContent = 'Processing your request...';
    
    // Assemble loading indicator
    loadingIndicator.appendChild(spinner);
    loadingIndicator.appendChild(loadingText);
    this.loadingIndicator = loadingIndicator;

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
    chatDiv.appendChild(loadingIndicator);
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
    
    // Create a message history container if it doesn't exist
    if (!this.messageHistoryContainer) {
      this.messageHistoryContainer = document.createElement('div');
      this.messageHistoryContainer.id = 'vix-message-history';
      this.messageHistoryContainer.style.maxHeight = '300px';
      this.messageHistoryContainer.style.overflowY = 'auto';
      this.messageHistoryContainer.style.marginBottom = '10px';
      this.messageHistoryContainer.style.border = '1px solid #e0e0e0';
      this.messageHistoryContainer.style.borderRadius = '4px';
      this.messageHistoryContainer.style.padding = '10px';
      
      // Insert the message history container before the input container
      const inputContainer = document.getElementById('vix-chat-input').parentElement;
      this.chatContainer.insertBefore(this.messageHistoryContainer, inputContainer);
    }
    
    // Clear the message history container
    this.messageHistoryContainer.innerHTML = '';
    
    // Add each message to the history
    for (const message of response) {
      const messageElement = document.createElement('div');
      messageElement.style.marginBottom = '10px';
      messageElement.style.padding = '8px 12px';
      messageElement.style.borderRadius = '4px';
      messageElement.style.maxWidth = '80%';
      
      // Style based on message direction
      if (message.direction === 'out') {
        messageElement.style.backgroundColor = '#e3f2fd';
        messageElement.style.marginLeft = 'auto';
        messageElement.style.textAlign = 'right';
      } else {
        messageElement.style.backgroundColor = '#f5f5f5';
        messageElement.style.marginRight = 'auto';
      }
      
      // Add role indicator if available
      let roleText = '';
      if (message.role) {
        roleText = `<strong>${message.role}:</strong> `;
      }
      
      // Set the message content
      messageElement.innerHTML = `${roleText}${message.content}`;
      
      // Add the message to the history container
      this.messageHistoryContainer.appendChild(messageElement);
    }
    
    // Scroll to the bottom of the message history
    this.messageHistoryContainer.scrollTop = this.messageHistoryContainer.scrollHeight;
    
    // Update status to indicate response received
    this.updateStatus('Response received');
  }

  handleSendMessage() {
    const message = this.inputField.value.trim();
    if (message && !this.isLoading) {
      this.isLoading = true;
      this.updateStatus('Processing your request...');
      this.sendButton.disabled = true;
      this.sendButton.textContent = 'Sending...';
      
      // Show loading indicator
      if (this.loadingIndicator) {
        this.loadingIndicator.style.display = 'flex';
      }
      
      // Add user message to the conversation immediately
      const userMessage = {
        role: 'user',
        direction: 'out',
        content: message,
      };
      
      // Add the user message to the conversation
      this.conversationProcessingService.addMessage(
        userMessage,
        (response) => {
          this.handleAddResponse(response);
          this.isLoading = false;
          this.sendButton.disabled = false;
          this.sendButton.textContent = 'Send';
          this.updateStatus('Ready for your next request');
          
          // Hide loading indicator
          if (this.loadingIndicator) {
            this.loadingIndicator.style.display = 'none';
          }
        }
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
