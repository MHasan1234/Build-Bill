import User from '../models/User.js';
import Invoice from '../models/Invoice.js';
import mongoose from "mongoose";


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password'); 
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin', 'accountant'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role specified.' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.role = role;
        await user.save();
        res.json({ message: 'User role updated successfully.' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        
        await Invoice.deleteMany({ user: user._id });
        await user.deleteOne();

        res.json({ message: 'User and all associated invoices have been deleted.' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getSiteAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalInvoices = await Invoice.countDocuments();
        const totalRevenueResult = await Invoice.aggregate([
            { $match: { status: 'Paid' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].totalRevenue : 0;

        res.json({
            totalUsers,
            totalInvoices,
            totalRevenue
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};