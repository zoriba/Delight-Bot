const { model, Schema } = require("mongoose");

let warningSchema = new Schema({
  GuildId: String,
  UserId: String,
  UserTag: String,
  warnings: [
    {
      ExecuterId: String,
      ExecuterTag: String,
      Reason: String,
    },
  ],
});

module.exports = model("warn", warningSchema);
