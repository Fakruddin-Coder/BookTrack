const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      maxlength: 120
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      maxlength: 100
    },
    genre: {
      type: String,
      trim: true,
      default: "Other",
      maxlength: 60
    },
    status: {
      type: String,
      enum: ["Want to Read", "Reading", "Completed"],
      default: "Want to Read"
    }
  },
  { timestamps: true }
);

bookSchema.index({ title: "text", author: "text" });

module.exports = mongoose.model("Book", bookSchema);
