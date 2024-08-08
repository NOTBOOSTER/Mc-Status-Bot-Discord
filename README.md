# Minecraft Server Status Discord Bot

This bot provides real-time status updates for your Minecraft server in a Discord channel. It fetches the server status, including player count and server online/offline status, and updates an embed message in your Discord server.

=======
![Screenshot 2024-08-07 104008](https://github.com/user-attachments/assets/6cfcb3c9-8879-422d-9ca1-dc3169ed9115)
![Screenshot 2024-08-07 102526](https://github.com/user-attachments/assets/b815690f-dbc3-44d6-acb4-46a18fa68313) 



## Features

- Real-time Minecraft server status updates
- Displays server information such as IP, player count, MOTD, and more

- Customizable through `config.yml`
- Customizable through `config.yml`

## Getting Started

Follow these instructions to set up and run the bot on your local machine.

### Prerequisites

- Node.js (version 14 or higher)
- A Discord bot token
- A Minecraft server

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/NOTBOOSTER/Mc-Status-Bot-Discord.git
   cd Mc-Status-Bot-Discord
   ```
   
2. Install the necessary dependencies:
   ```sh
   npm install
   ```

4. Rename the configuration file and enter your details:

   ```sh
   mv config.yml.example config.yml
   ```

5. Open `config.yml` in your favorite text editor and enter your configuration details:

   ```yaml
   TOKEN: "YOUR_DISCORD_BOT_TOKEN"
   BOTNAME: "YourBotName"

   setup:
     bannerLink: "YOUR_BANNER_LINK"
     iconLink: "YOUR_ICON_LINK"
     onlineColor: "#00e30f"
     offlineColor: "#ff2121"
     userId: "YOUR_USER_ID"
     command: "Bsetup"
     enableCmd: true

   server:
     name: "Your Server Name"
     description: "Your Server Description"
     host: "your.server.ip"
     port: "25565"
     version: "[1.8.x - 1.21.x]"
     defaultPort: true
     delay: 15

   emojis:
     Online: "<a:ServerOnline:123456789012345678>"
     Offline: "<a:Serveroffline:123456789012345678>"
   
   options:
     ip: true
     port: false
     players: true
     version: false
     motd: false
     icon: true
     banner: true
   ```

6. Run the bot:

   ```sh
   node index.js
   ```

### Usage

- To set up the status panel, use the command specified in the `config.yml` under `setup.command` (default is `Bsetup`). This will create the initial embed message which will be updated with the server status.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. You are free to use the bot for your server but not to redistribute, resell, or claim it as your own.

### Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements.

### Acknowledgments

- Made by NOTBOOSTER with ❤️
- Check for updates on [GitHub](https://github.com/NOTBOOSTER/Mc-Status-Bot-Discord)
