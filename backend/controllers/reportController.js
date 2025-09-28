import Invoice from '../models/Invoice.js';


export const getAllInvoicesForReport = async (req, res) => {
    try {
    
        const invoices = await Invoice.find({}).sort({ createdAt: -1 });
        res.json(invoices);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getRevenueSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.body;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'Please provide both a start and end date.' });
        }

        const revenueResult = await Invoice.aggregate([
            {
                $match: {
                    status: 'Paid',
                    createdAt: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    numberOfInvoices: { $sum: 1 }
                }
            }
        ]);

        const summary = {
            startDate,
            endDate,
            totalRevenue: revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0,
            numberOfInvoices: revenueResult.length > 0 ? revenueResult[0].numberOfInvoices : 0,
        };

        res.json(summary);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const exportInvoicesToCSV = async (req, res) => {
    try {
        const invoices = await Invoice.find({}).populate('user', 'name email');

        let csv = 'InvoiceID,ClientName,ClientEmail,Status,TotalAmount,Date,BilledBy\n';

        invoices.forEach(invoice => {
            csv += `${invoice._id},${invoice.clientName},${invoice.clientEmail},${invoice.status},${invoice.totalAmount},${invoice.createdAt.toISOString().split('T')[0]},${invoice.user.name}\n`;
        });

        res.header('Content-Type', 'text/csv');
        res.attachment('invoices-export.csv');
        res.send(csv);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};