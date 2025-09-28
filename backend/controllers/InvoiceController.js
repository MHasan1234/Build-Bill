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

    
    if (status && ['Paid', 'Unpaid'].includes(status)) {
      query.status = status;
    }

    
    if (search) {
      query.clientName = { $regex: search, $options: 'i' }; 
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




export const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId, 
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

    
    const doc = new PDFDocument({
      margin: 50,
      size: 'A4',
      info: {
        Title: `Invoice ${invoice._id}`,
        Author: 'BuildBill',
        Creator: 'BuildBill'
      }
    });

    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=invoice_${invoice._id}.pdf`);
    res.setHeader("Cache-Control", "no-cache");

    
    doc.pipe(res);

    
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();

    
    doc.fontSize(12);
    doc.text(`Invoice ID: ${invoice._id.toString().slice(-8).toUpperCase()}`);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
    doc.text(`Status: ${invoice.status}`);
    doc.moveDown();

    
    doc.fontSize(14).text('BILL TO:', { underline: true });
    doc.fontSize(12);
    doc.text(`Name: ${invoice.clientName || 'N/A'}`);
    doc.text(`Email: ${invoice.clientEmail || 'N/A'}`);
    doc.moveDown();

    
    doc.fontSize(14).text('ITEMS:', { underline: true });
    doc.moveDown();

  
    doc.text('Description', 50, doc.y);
    doc.text('Qty', 300, doc.y);
    doc.text('Rate', 350, doc.y);
    doc.text('Amount', 450, doc.y);
    

    doc.moveTo(50, doc.y + 5)
       .lineTo(550, doc.y + 5)
       .stroke();
    
    doc.moveDown();

    
    (invoice.items || []).forEach((item, index) => {
      const quantity = Number(item.quantity) || 0;
      const rate = Number(item.rate) || 0;
      const description = item.description || 'No description';
      const total = quantity * rate;

      doc.text(description, 50);
      doc.text(quantity.toString(), 300);
      doc.text(`₹${rate.toFixed(2)}`, 350);
      doc.text(`₹${total.toFixed(2)}`, 450);
      doc.moveDown();
    });

    doc.moveDown();
    
    
    doc.fontSize(16).text(`TOTAL AMOUNT: ₹${(invoice.totalAmount || 0).toFixed(2)}`, { align: 'right' });
    doc.moveDown();

    
    doc.fontSize(10)
       .text('Thank you for your business!', { align: 'center' })
       .text('Generated by BuildBill', { align: 'center' });

  
    doc.end();

  } catch (err) {
    console.error("PDF Generation Error:", err);
    
    
    if (err.message.includes('font') || err.message.includes('read')) {
      res.status(500).json({ 
        error: "PDF generation temporarily unavailable. Please try again later." 
      });
    } else {
      res.status(500).json({ error: "Failed to generate PDF" });
    }
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


export const getInvoicesByClient = async (req, res) => {
    try {
        const { clientName } = req.params;
        const invoices = await Invoice.find({ 
            user: req.user.userId, 
            clientName: decodeURIComponent(clientName) 
        }).sort({ createdAt: -1 });

        if (!invoices) {
            return res.status(404).json({ error: 'No invoices found for this client' });
        }
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};