/*
 * Swanky Tools™ Universal Chat Widget (v1.0.0)
 * Lightweight, embeddable, customizable chat widget that connects to any webhook.
 * Author: SwankyTools™
 * License: MIT
 */

(function () {
  const config = window.ChatWidgetConfig || {};
  const webhookUrl = config.webhook?.url || null;
  const branding = config.branding || {};
  const style = config.style || {};
  const suggestions = config.suggestions || [];

  if (!webhookUrl) {
    console.error('[ChatWidget] Missing webhook URL in ChatWidgetConfig');
    return;
  }

  // Create styles
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    .swanky-chat-btn {
      position: fixed;
      ${style.position === 'left' ? 'left' : 'right'}: 20px;
      bottom: 20px;
      background-color: ${style.primaryColor || '#10b981'};
      color: #fff;
      border: none;
      border-radius: 9999px;
      padding: 12px 20px;
      cursor: pointer;
      z-index: 9999;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .swanky-chat-window {
      position: fixed;
      ${style.position === 'left' ? 'left' : 'right'}: 20px;
      bottom: 80px;
      width: 320px;
      max-height: 500px;
      background: ${style.backgroundColor || '#fff'};
      color: ${style.fontColor || '#111827'};
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: sans-serif;
      z-index: 9999;
    }
    .swanky-chat-header {
      background-color: ${style.secondaryColor || '#059669'};
      padding: 12px;
      color: white;
      font-weight: bold;
    }
    .swanky-chat-body {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
    }
    .swanky-chat-input {
      display: flex;
      border-top: 1px solid #eee;
    }
    .swanky-chat-input input {
      flex: 1;
      padding: 10px;
      border: none;
      font-size: 14px;
    }
    .swanky-chat-input button {
      background-color: ${style.primaryColor || '#10b981'};
      border: none;
      color: white;
      padding: 10px 15px;
      cursor: pointer;
    }
    .swanky-chat-message {
      margin-bottom: 8px;
      padding: 6px 10px;
      border-radius: 8px;
    }
    .swanky-chat-message.user {
      background-color: ${style.primaryColor || '#10b981'}33;
      align-self: flex-end;
    }
    .swanky-chat-message.bot {
      background-color: #f3f4f6;
      align-self: flex-start;
    }
  `;
  document.head.appendChild(styleEl);

  // Create chat button
  const button = document.createElement('button');
  button.className = 'swanky-chat-btn';
  button.innerHTML = `<img src="${branding.logo || ''}" alt="logo" style="width:20px;height:20px;border-radius:50%;"> ${branding.name || 'Chat'}`;
  document.body.appendChild(button);

  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.className = 'swanky-chat-window';
  chatWindow.style.display = 'none';
  chatWindow.innerHTML = `
    <div class="swanky-chat-header">${branding.welcomeText || 'Welcome!'}</div>
    <div class="swanky-chat-body"></div>
    <div class="swanky-chat-input">
      <input type="text" placeholder="Type your message...">
      <button>Send</button>
    </div>
  `;
  document.body.appendChild(chatWindow);

  const bodyEl = chatWindow.querySelector('.swanky-chat-body');
  const inputEl = chatWindow.querySelector('input');
  const sendBtn = chatWindow.querySelector('button');

  function appendMessage(text, sender = 'bot') {
    const msg = document.createElement('div');
    msg.className = `swanky-chat-message ${sender}`;
    msg.textContent = text;
    bodyEl.appendChild(msg);
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  sendBtn.onclick = async () => {
    const text = inputEl.value.trim();
    if (!text) return;
    appendMessage(text, 'user');
    inputEl.value = '';
    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      appendMessage(data.output || data.message || '...', 'bot');
    } catch (e) {
      appendMessage('Oops, something went wrong.', 'bot');
      console.error(e);
    }
  };

  button.onclick = () => {
    chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
  };
})();
