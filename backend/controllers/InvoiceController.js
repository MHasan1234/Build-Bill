import Invoice from "../models/Invoice.js";
import nodemailer from "nodemailer";
import PDFDocument from "pdfkit";

export const createInvoice = async (req, res) => {
    console.log("API Hit")
  try {
    const invoice = new Invoice({
      ...req.body,
      user: req.user.userId,
    });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = { user: req.user.userId };

    // Add status to query if it exists and is valid
    if (status && ['Paid', 'Unpaid'].includes(status)) {
      query.status = status;
    }

    // Add clientName search to query if it exists
    if (search) {
      query.clientName = { $regex: search, $options: 'i' }; // 'i' for case-insensitive
    }

    const invoices = await Invoice.find(query).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
       user: req.user.userId,
  });
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// controllers/InvoiceController.js

export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId, // secure: only update your own invoice
      },
      req.body,
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found or unauthorized" });
    }

    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const deleteInvoice = async (req, res) => {
  try {
    const result = await Invoice.findOneAndDelete({
      _id: req.params.id,
       user: req.user.userId,
  });

    if (!result) {
      return res.status(404).json({ error: "Invoice not found" });
    }

      res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



export const sendInvoiceEmail = async (req, res) => {
  try {
    // 1. Fetch the invoice by ID + user
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found or unauthorized" });
    }

    // 2. Create a test SMTP service using ethereal.email (free)
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // 3. Format items
    const itemsList = invoice.items
      .map(
        (item, i) =>
          `${i + 1}. ${item.description} — ${item.quantity} x ₹${item.rate}`
      )
      .join("<br>");

    // 4. Send email
    const info = await transporter.sendMail({
      from: `"BuildBill" <no-reply@buildbill.com>`,
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

    console.log(" Preview URL:", nodemailer.getTestMessageUrl(info));

    res.json({
      message: "Email sent successfully",
      previewUrl: nodemailer.getTestMessageUrl(info),
    });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send invoice email" });
  }
};


export const markAsPaid = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { status: "Paid" },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found or unauthorized" });
    }

    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const markAsUnpaid = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { status: "Unpaid" },
      { new: true }
    );

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found or unauthorized" });
    }

    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



export const generateInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found or unauthorized" });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=invoice_${invoice._id}.pdf`);

    doc.pipe(res);

    // === PDF Content ===
    doc.fontSize(22).text("Invoice", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Client: ${invoice.clientName}`);
    doc.text(`Email: ${invoice.clientEmail}`);
    doc.text(`Status: ${invoice.status}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(16).text("Items:");
    invoice.items.forEach((item, i) => {
      doc.text(
        `${i + 1}. ${item.description} — ${item.quantity} × ₹${item.rate} = ₹${item.quantity * item.rate}`
      );
    });

    doc.moveDown();
    doc.fontSize(16).text(`Total Amount: ₹${invoice.totalAmount}`, { bold: true });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};

export const getAllInvoicesAdmin = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.userId;

    const totalInvoices = await Invoice.countDocuments({
      user: userId
    });

    const paidInvoices = await Invoice.countDocuments({
      user: userId,
      status: "Paid"
    });

    const unpaidInvoices = await Invoice.countDocuments({
      user: userId,
      status: "Unpaid"
    });

    const invoices = await Invoice.find({ user: userId });
    const totalIncome = invoices.reduce((sum, invoice) => {
        if (invoice.status === 'Paid') {
            return sum + invoice.totalAmount;
        }
        return sum;
    }, 0);


    res.json({
      totalInvoices,
      paidInvoices,
      unpaidInvoices,
      totalIncome
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};