/*
 * Swanky Tools™ Universal Chat Widget (v1.0.1)
 * MIT License – Use it, customize it, ship it!
 * Author: SwankyTools™
 */

(function () {
  const config = window.ChatWidgetConfig || {};
  const webhookUrl = config.webhook?.url || '';
  const branding = config.branding || {};
  const style = config.style || {};
  const suggestions = config.suggestions || [];

  if (!webhookUrl) {
    console.error('[ChatWidget] Missing webhook URL in ChatWidgetConfig');
    return;
  }

  // Inject CSS styles
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    .swanky-chat-button {
      position: fixed;
      ${style.position === 'left' ? 'left' : 'right'}: 20px;
      bottom: 20px;
      z-index: 9999;
      background-color: ${style.primaryColor || '#10b981'};
      color: #fff;
      padding: 12px 18px;
      border-radius: 50px;
      font-size: 15px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: sans-serif;
    }
    .swanky-chat-window {
      position: fixed;
      bottom: 80px;
      ${style.position === 'left' ? 'left' : 'right'}: 20px;
      width: 320px;
      height: 400px;
      background-color: ${style.backgroundColor || '#ffffff'};
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 10000;
      font-family: sans-serif;
    }
    .swanky-chat-header {
      background-color: ${style.secondaryColor || '#059669'};
      color: ${style.fontColor || '#fff'};
      padding: 10px 16px;
      font-weight: bold;
    }
    .swanky-chat-body {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      font-size: 14px;
      color: ${style.fontColor || '#1f2937'};
    }
    .swanky-chat-input {
      display: flex;
      border-top: 1px solid #ccc;
    }
    .swanky-chat-input input {
      flex: 1;
      border: none;
      padding: 10px;
      font-size: 14px;
      outline: none;
    }
    .swanky-chat-input button {
      background-color: ${style.primaryColor || '#10b981'};
      border: none;
      color: #fff;
      padding: 10px 16px;
      cursor: pointer;
    }
    .swanky-chat-message {
      margin: 5px 0;
    }
    .swanky-chat-message.user {
      text-align: right;
    }
  `;
  document.head.appendChild(styleEl);

  // Create chat button
  const button = document.createElement('button');
  button.className = 'swanky-chat-button';
  button.innerHTML = `<img src="${branding.logo || ''}" alt="logo" style="width:20px;height:20px;border-radius:50%;"> ${branding.buttonText || '💬 Chat'}`;
  document.body.appendChild(button);

  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.className = 'swanky-chat-window';
  chatWindow.innerHTML = `
    <div class="swanky-chat-header">${branding.name || 'ChatBot'}</div>
    <div class="swanky-chat-body" id="chatBody">
      <div class="swanky-chat-message">${branding.welcomeText || 'Hi! How can I help you?'}</div>
    </div>
    <div class="swanky-chat-input">
      <input type="text" id="chatInput" placeholder="Type your message..." />
      <button id="chatSendBtn">Send</button>
    </div>
  `;
  document.body.appendChild(chatWindow);

  // Event handlers
  button.onclick = () => {
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
  };

  document.getElementById('chatSendBtn').onclick = async () => {
    const input = document.getElementById('chatInput');
    const msg = input.value.trim();
    if (!msg) return;
    const chatBody = document.getElementById('chatBody');
    const msgEl = document.createElement('div');
    msgEl.className = 'swanky-chat-message user';
    msgEl.innerText = msg;
    chatBody.appendChild(msgEl);
    input.value = '';

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      });
      const json = await res.json();
      const botRes = document.createElement('div');
      botRes.className = 'swanky-chat-message';
      botRes.innerText = json.output || 'Sorry, I couldn’t understand.';
      chatBody.appendChild(botRes);
    } catch (e) {
      const botRes = document.createElement('div');
      botRes.className = 'swanky-chat-message';
      botRes.innerText = '⚠️ Could not connect to AI.';
      chatBody.appendChild(botRes);
    }
    chatBody.scrollTop = chatBody.scrollHeight;
  };
})();
