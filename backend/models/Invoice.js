import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  rate: Number,
});

const invoiceSchema = new mongoose.Schema({
  clientName: String,
  clientEmail: String,
  items: [itemSchema],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["Paid", "Unpaid"],
    default: "Unpaid"
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Invoice", invoiceSchema);
