const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TeacherSchema = new Schema({
  name: String,
  video: String,
  imgCover: {
    type: String,
    default: "https://ucarecdn.com/5d276379-552f-4a08-97e7-744a15f71477/ava.png"
  },
  description: String,
  address: String,
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
  time: [
    // optional
    {
      date: String,
      hour: [
        {
          name: String,
          quantity: Number
        }
      ]
    }
  ],
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Teacher", TeacherSchema);
