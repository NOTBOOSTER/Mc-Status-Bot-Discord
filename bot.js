const {
  Client,
  GatewayIntentBits,
  Discord,
  EmbedBuilder,
  WebhookClient,
  MessageEmbed,
  ActivityType,
} = require("discord.js");
const yaml = require("js-yaml");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

//importing variables

const config = yaml.load(fs.readFileSync("./config.yml", "utf8"));
const messageId = yaml.load(fs.readFileSync("messageId.yml", "utf8"));
const token = config.TOKEN;
const server = config.server;
const options = config.options;
const setup = config.setup;
const prefix = `\x1b[31m${config.BOTNAME} ▶ \x1b[33m`;

// some basics things
console.log(`${prefix}Starting Bot...`);
console.log(`${prefix}Made By NOTBOOSTER with ❤️`);
console.log(`\x1b[31m
███╗░░██╗░█████╗░████████╗██████╗░░█████╗░░█████╗░░██████╗████████╗███████╗██████╗░
████╗░██║██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██╔════╝██╔══██╗
██╔██╗██║██║░░██║░░░██║░░░██████╦╝██║░░██║██║░░██║╚█████╗░░░░██║░░░█████╗░░██████╔╝
██║╚████║██║░░██║░░░██║░░░██╔══██╗██║░░██║██║░░██║░╚═══██╗░░░██║░░░██╔══╝░░██╔══██╗
██║░╚███║╚█████╔╝░░░██║░░░██████╦╝╚█████╔╝╚█████╔╝██████╔╝░░░██║░░░███████╗██║░░██║
╚═╝░░╚══╝░╚════╝░░░░╚═╝░░░╚═════╝░░╚════╝░░╚════╝░╚═════╝░░░░╚═╝░░░╚══════╝╚═╝░░╚═╝\x1b[0m`);
console.log(`${prefix}Check Github For Updates`);
console.log(`${prefix}https://github.com/NOTBOOSTER/Mc-Status-Bot-Discord`);

// Bot ready Event
client.once("ready", () => {
  console.log(`${prefix}Logged in as \x1b[31m${client.user.tag}!\x1b[0m`);
});

//Fatching status from mcstatus api
async function fetchServerStatus() {
  try {
    if (server.defaultPort) {
      const response = await axios.get(
        `https://api.mcstatus.io/v2/status/java/${server.host}:25565`
      );
      return response.data;
    } else {
      const response = await axios.get(
        `https://api.mcstatus.io/v2/status/java/${server.host}:${server.port}`
      );
      return response.data;
    }
  } catch (error) {
    console.error("Error fetching server status:", error);
    return null;
  }
}

//Status panel setup  cmd
client.on("messageCreate", async (message) => {
  if (
    message.content == setup.command &&
    message.author.id == setup.userId &&
    setup.enableCmd
  ) {
    const setupEmbed = new EmbedBuilder()
      .setColor("#ffffff")
      .setDescription("Status Panel is setuped please restart the bot.");
    let embedId = message.channel.send({ embeds: [setupEmbed] });
    storeMessageId((await embedId).id, message.channelId);
    console.log(`${prefix}Status Panel is setuped please restate the bot.`);
    process.exit();
  }
});

//Updating status panel
setInterval(async () => {
  try {
    const status = await fetchServerStatus();
    const embed = new EmbedBuilder();
    if (status.online) {
      if (setup.activity) {
        client.user.setActivity({
          name: `${status.players.online}/${status.players.max} Players Playing`,
          type: ActivityType.Playing,
        });
      }

      embed.setColor(`${setup.onlineColor}`).setTitle(`${server.name} Status`);
      if (options.icon) {
        embed.setThumbnail(setup.iconLink);
      }
      if (options.banner) {
        embed.setImage(setup.bannerLink);
      }
      if (options.ip) {
        embed.addFields({ name: "Ip", value: server.host, inline: setup.inline });
      }
      if (options.port) {
        embed.addFields({ name: "Port", value: server.port, inline: setup.inline });
      }
      embed.addFields({
        name: "Status",
        value: `${config.emojis.Online} Online`,
        inline: setup.inline,
      });
      if (options.players) {
        embed.addFields({
          name: "Players",
          value: `${status.players.online}/${status.players.max}`,
          inline: setup.inline,
        });
      }
      if (options.version) {
        embed.addFields({
          name: "Version",
          value: `${server.version}`,
          inline: setup.inline,
        });
      }
      if (options.motd) {
        embed.addFields({
          name: "MOTD",
          value: `\`\`\`${status.motd.clean}\`\`\``,
          inline: false, // default is false
        });
      }
    } else {
      if (setup.activity) {
        client.user.setActivity({
          name: `Server Is Offline `,
          type: ActivityType.Playing,
        });
      }
      embed.setColor(`${setup.offlineColor}`).setTitle(`${server.name} Status`);
      if (options.icon) {
        embed.setThumbnail(setup.iconLink);
      }
      if (options.banner) {
        embed.setImage(setup.bannerLink);
      }
      if (options.ip) {
        embed.addFields({ name: "Ip", value: server.host, inline: setup.inline });
      }
      if (options.port) {
        embed.addFields({ name: "Port", value: server.port, inline: setup.inline });
      }
      embed.addFields({
        name: "Status",
        value: `${config.emojis.Offline} Offline`,
        inline: setup.inline,
      });
      if (options.version) {
        embed.addFields({
          name: "Version",
          value: `${server.version}`,
          inline: setup.inline,
        });
      }
    }
    const msgId = messageId.messageId;
    const channelId = messageId.channelId;
    if (channelId) {
      const channel = client.channels.cache.get(channelId);
      if (channel) {
        if (msgId) {
          channel.messages
            .fetch(msgId)
            .then((message) => {
              if (message) {
                message.edit({ embeds: [embed] });
              } else {
                console.error("Message not found.");
              }
            })
            .catch((error) => console.error("Error fetching message:", error));
        }
      } else {
        console.error("Channel not found.");
      }
    }
  } catch (error) {
    console.error("Error fetching server status:", error);
  }
}, server.delay * 1000);

// Function to store message id in a file
const messageIdFilePath = path.join(__dirname, "messageId.yml");

function storeMessageId(messageId, channelId) {
  const data = { messageId, channelId };
  fs.writeFileSync(messageIdFilePath, yaml.dump(data), "utf8");
}

// Bot login 

client.login(token);
