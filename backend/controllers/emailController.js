import nodemailer from "nodemailer";
import Invoice from "../models/Invoice.js";

export const sendInvoiceEmail = async (req, res) => {
    try {
      const invoice = await Invoice.findOne({
        _id: req.params.id,
        user: req.user.userId,
      });
  
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found or unauthorized" });
      }
  
      
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, 
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
  
      const itemsList = invoice.items
        .map(
          (item, i) =>
            `${i + 1}. ${item.description} — ${item.quantity} x ₹${item.rate}`
        )
        .join("<br>");
  
      await transporter.sendMail({
        from: `"BuildBill" <${process.env.EMAIL_USER}>`, 
        to: invoice.clientEmail,
        subject: `Invoice from ${req.user.name || "BuildBill"}`,
        html: `
          <h2>Invoice Summary</h2>
          <p><strong>Client:</strong> ${invoice.clientName}</p>
          <p><strong>Status:</strong> ${invoice.status}</p>
          <p><strong>Items:</strong><br>${itemsList}</p>
          <p><strong>Total:</strong> ₹${invoice.totalAmount}</p>
          <p><em>Created at: ${new Date(invoice.createdAt).toLocaleString()}</em></p>
        `,
      });
  
      res.json({ message: "Email sent successfully!" });
  
    } catch (err) {
      console.error("Email error:", err);
      res.status(500).json({ error: "Failed to send invoice email" });
    }
  };