import Invoice from "../models/Invoice.js";

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