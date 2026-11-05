/* ZH Climate Solutions — site settings
 * formEndpoint: paste a form-service URL here to receive requests straight to your inbox
 *   (e.g. Formspree "https://formspree.io/f/XXXXXXX" or Web3Forms "https://api.web3forms.com/submit").
 *   Leave empty and the form opens the visitor's email app with the request filled in.
 * web3formsKey: only needed when using Web3Forms.
 */
window.ZH_CONFIG = {
  formEndpoint: "",
  // Chat assistant: "/api/chat" uses Claude when the server has ANTHROPIC_API_KEY set;
  // otherwise (or when opened as a file) it falls back to built-in answers automatically. Set to "" to always use built-in answers.
  aiEndpoint: "/api/chat",
  web3formsKey: "",
  email: "zhclimatesolutions@gmail.com",
  phone: "647-614-4019"
};
