import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

// This ensures that a user cannot have two clients with the same email address
clientSchema.index({ email: 1, user: 1 }, { unique: true });

export default mongoose.model("Client", clientSchema);
