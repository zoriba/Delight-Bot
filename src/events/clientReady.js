const { Events } = require("discord.js");
const chalk = require("chalk");
const mongoose = require("mongoose");
const mongoUrl = process.env.mongoUrl;
module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    console.log(chalk.green(`Ready! Logged in as ${client.user.tag}`));

    await mongoose.connect(mongoUrl || "").catch((err) => {
      console.log(chalk.red("[Warning] Could not connect to the database!"));
      console.log(err);
    });
    if (mongoose.connect) {
      console.log(chalk.green("Connected to the DB"));
    }
  },
};
