import Client from '../models/Clients.js';

// @desc    Create a new client
// @route   POST /api/clients
// @access  Private (for the logged-in user)
export const createClient = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Client name and email are required.' });
        }

        // Check if a client with this email already exists for this user
        const existingClient = await Client.findOne({ email, user: req.user.userId });
        if (existingClient) {
            return res.status(400).json({ error: 'A client with this email already exists.' });
        }

        const client = new Client({
            ...req.body,
            user: req.user.userId,
        });
        await client.save();
        res.status(201).json(client);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// @desc    Get all clients for the logged-in user
// @route   GET /api/clients
// @access  Private
export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find({ user: req.user.userId }).sort({ name: 1 });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
