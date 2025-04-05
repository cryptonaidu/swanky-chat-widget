/*
 * Swanky Tools™ Universal Chat Widget (v1.1.0)
 * Lightweight, embeddable, customizable chat widget that connects to any webhook.
 * Author: SwankyTools™
 * License: MIT
 */

(function () {
  const config = window.ChatWidgetConfig || {};
  const webhookInfo = config.webhook || {};
  const branding = config.branding || {};
  const style = config.style || {};
  const suggestions = config.suggestions || [];

  if (!webhookInfo.url) {
    console.error('[ChatWidget] Missing webhook URL in ChatWidgetConfig');
    return;
  }

  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    #swanky-chat-button {
      position: fixed;
      ${style.position === 'left' ? 'left' : 'right'}: 20px;
      bottom: 20px;
      background-color: ${style.primaryColor || '#10b981'};
      color: white;
      border: none;
      border-radius: 30px;
      padding: 12px 20px;
      font-size: 16px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      cursor: pointer;
      z-index: 9999;
    }
    .swanky-chat-window {
      position: fixed;
      ${style.position === 'left' ? 'left' : 'right'}: 20px;
      bottom: 80px;
      width: 320px;
      height: 400px;
      background-color: ${style.backgroundColor || '#ffffff'};
      border: 1px solid ${style.borderColor || '#e5e7eb'};
      border-radius: 10px;
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      font-family: sans-serif;
      display: none;
      flex-direction: column;
      z-index: 9999;
    }
    .swanky-chat-header {
      background-color: ${style.secondaryColor || '#059669'};
      color: ${style.fontColor || '#ffffff'};
      padding: 10px;
      font-weight: bold;
      font-size: 16px;
    }
    .swanky-chat-body {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      background: #f9fafb;
      font-size: 14px;
    }
    .swanky-chat-input {
      display: flex;
      padding: 10px;
      border-top: 1px solid #e5e7eb;
    }
    .swanky-chat-input input {
      flex: 1;
      padding: 8px;
      border: 1px solid #d1d5db;
      border-radius: 5px;
    }
    .swanky-chat-input button {
      margin-left: 8px;
      padding: 8px 12px;
      background-color: ${style.primaryColor || '#10b981'};
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    .swanky-chat-message {
      margin: 6px 0;
    }
    .swanky-chat-message.user {
      text-align: right;
      color: ${style.primaryColor || '#10b981'};
    }
    .swanky-chat-message.bot {
      text-align: left;
      color: #374151;
    }
  `;
  document.head.appendChild(styleEl);

  // Create button
  const button = document.createElement('button');
  button.id = 'swanky-chat-button';
  button.innerHTML = branding.buttonText || '💬 Need help?';
  document.body.appendChild(button);

  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.className = 'swanky-chat-window';
  chatWindow.innerHTML = `
    <div class="swanky-chat-header">${branding.welcomeText || 'Welcome!'}</div>
    <div class="swanky-chat-body" id="swanky-chat-body">
      <div class="swanky-chat-message bot">${branding.responseTimeText || 'Ask us anything below 👇'}</div>
    </div>
    <div class="swanky-chat-input">
      <input type="text" id="swanky-chat-input" placeholder="Type a message..." />
      <button id="swanky-send-btn">Send</button>
    </div>
  `;
  document.body.appendChild(chatWindow);

  // Show/hide chat
  button.onclick = () => {
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
  };

  // Message send logic
  const input = chatWindow.querySelector('#swanky-chat-input');
  const sendBtn = chatWindow.querySelector('#swanky-send-btn');
  const body = chatWindow.querySelector('#swanky-chat-body');

  async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    appendMessage('user', message);
    input.value = '';

    try {
      const response = await fetch(webhookInfo.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: webhookInfo.route || 'default',
          message
        })
      });

      const result = await response.json();
      appendMessage('bot', result.output || 'Sorry, something went wrong.');
    } catch (e) {
      appendMessage('bot', '⚠️ Error reaching server.');
    }
  }

  function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = `swanky-chat-message ${sender}`;
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  sendBtn.onclick = sendMessage;
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
})();
