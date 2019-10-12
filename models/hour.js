const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const HourSchema = new Schema(
  {
    duration: String,
    quantity: String,
    create_at: {
      type: Date,
      default: Date.now
    },
    update_at: {
      type: Date
    },
    delete_at: {
      type: Date
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    strict: false
  }
);

module.exports = mongoose.model("Hour", HourSchema);
