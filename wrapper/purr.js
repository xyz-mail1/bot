const fetch = require("node-fetch");

module.exports = class PurrBot {
  constructor() {
    this.baseUrl = "https://purrbot.site/api/img";
  }
  async sfw(type) {
    try {
      const response = await fetch(`${this.baseUrl}/sfw/${type}/gif`);

      const data = await response.json();
      if (data.error) {
        const response = await fetch(`${this.baseUrl}/sfw/${type}/img`);
        const data = response.json();
        return data;
      }
      return data;
    } catch (error) {
      return { error: error.message }; // Return an error message
    }
  }
  async nsfw(type) {
    try {
      const response = await fetch(`${this.baseUrl}/nsfw/${type}/gif`);
      const data = await response.json();
      if (data.error) {
        const response = await fetch(`${this.baseUrl}/nsfw/${type}/img`);
        const data = response.json();
        return data;
      }
      return data;
    } catch (err) {
      console.log(`error: ${err.message}`);
    }
  }
};
