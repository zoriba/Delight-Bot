const { model, Schema } = require("mongoose");

let greetSchema = new Schema({
  GuildID: String,
  Toggle: Boolean,
  Message: String,
  Channel: String,
});

module.exports = model("greet", greetSchema);
