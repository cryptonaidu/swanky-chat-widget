<!-- Widget Configuration -->
<script>
window.ChatWidgetConfig = {
  webhook: {
    url: 'https://n8n.srv768839.hstgr.cloud/webhook/6348875a-469d-4206-a581-825a1f0b816c/chat',
    route: 'general'
  },
  branding: {
    logo: 'https://swankytools.com/wp-content/uploads/2024/09/cropped-Logo-Swanky-grn-blk-nut.png',
    name: 'Swanky Tools™',
    welcomeText: 'Get instant answers to your questions!',
    responseTimeText: 'Click the button below to start chatting',
    buttonText: '💬 Need help?'
  },
  style: {
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    position: 'right',
    backgroundColor: '#ffffff',
    fontColor: '#1f2937'
  },
  fields: [
    {
      id: 'name',
      type: 'text',
      label: 'Name',
      placeholder: 'Your name',
      required: true
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Your email address',
      required: true
    }
  ],
  startButtonText: 'Continue to Chat'
};
</script>

<!-- CORRECT Script Tag -->
<script src="https://cryptonaidu.github.io/swanky-chat-widget/chat-widget.js"></script>
