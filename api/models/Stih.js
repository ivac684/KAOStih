import mongoose from "mongoose";

const StihSchema = new mongoose.Schema(
  {
    stih: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("stih", StihSchema);
