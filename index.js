// Creating whatsapp bot
// Import the necessary libraries
const venom = require("venom-bot");
const axios = require("axios");
const { MessageMedia } = require("venom-bot");

// Initialize the bot
venom
  .create(
    "whatsapp-session", // session name
    (base64Qr, asciiQR, attempts, urlCode) => {
      console.log(asciiQR); // Optional to log the QR code in the terminal
    },
    (statusSession, session) => {
      console.log("Status Session: ", statusSession); // Optional to log the session status
      console.log("Session name: ", session);
    },
    {
      folderNameToken: "tokens", // Folder name when saving tokens
      mkdirFolderToken: "", // Folder directory tokens, default is root directory
      headless: true, // Headless mode
      devtools: false, // Open devtools by default
      useChrome: true, // If false will use Chromium instance
      debug: false, // Opens a debug session
      logQR: true, // Logs QR automatically in terminal
      browserArgs: [""], // Parameters to be added into the chrome browser instance
      disableSpins: true, // Will disable Spinnies animation, useful for containers (docker) for a better log
      disableWelcome: true, // Will disable the welcoming message which appears in the beginning
      updatesLog: true, // Logs info updates automatically in terminal
      autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds)
      createPathFileToken: true, // Create path to save tokens
    }
  )
  .then((client) => start(client))
  .catch((error) => console.log(error));

function start(client) {
  client.onMessage(async (message) => {
    try {
      console.log("Received message:", message.body); // Log received message
      if (message.body && message.body === "!tagall") {
        const chat = await client.getChatById(message.from);
        let mentions = [];
        for (let participant of chat.groupMetadata.participants) {
          mentions.push(participant.id._serialized);
        }
        await client.sendMentioned(message.from, "Hello everyone!", mentions);
        console.log("Tag all command executed");
      } else if (message.body && message.body.startsWith("!kick ")) {
        const number = message.body.split(" ")[1] + "@c.us";
        await client.removeParticipant(message.from, number);
        console.log("Kick command executed");
      } else if (message.body && message.body === "!lock") {
        await client.setGroupToAdminsOnly(message.from, true);
        console.log("Lock command executed");
      } else if (message.body && message.body === "!unlock") {
        await client.setGroupToAdminsOnly(message.from, false);
        console.log("Unlock command executed");
      } else if (message.body && message.body.startsWith("!setname ")) {
        const name = message.body.replace("!setname ", "");
        await client.setGroupSubject(message.from, name);
        console.log("Set name command executed");
      } else if (message.body && message.body.startsWith("!setdesc ")) {
        const description = message.body.replace("!setdesc ", "");
        await client.setGroupDescription(message.from, description);
        console.log("Set description command executed");
      }
    } catch (error) {
      console.log("Error handling message:", error);
    }
  });
}
