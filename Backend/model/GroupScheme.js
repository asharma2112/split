const mongoose = require("mongoose");

const groupSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  inviteCode: {
    type: String,
    unique: true
  },
  members: {
    type: [String],
    required: true
  },
  accessUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Groups", groupSchema);
