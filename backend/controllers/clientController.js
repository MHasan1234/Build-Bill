import Client from '../models/Clients.js';


export const createClient = async (req, res) => {
    try {
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: 'Client name and email are required.' });
        }


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

export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find({ user: req.user.userId }).sort({ name: 1 });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const updateClient = async (req, res) => {
    try {
        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );
         if (!client) {
            return res.status(404).json({ error: "Client not found or you're not authorized to edit it." });
        }

        res.json(client);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const deleteClient = async (req, res) => {
    try {
        const client = await Client.findOneAndDelete({ _id: req.params.id, user: req.user.userId });

        if (!client) {
            return res.status(404).json({ error: "Client not found or you're not authorized to delete it." });
        }

        res.json({ message: 'Client removed successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getClientById = async (req, res) => {
    try {
        const client = await Client.findOne({ _id: req.params.id, user: req.user.userId });
        if (!client) {
            return res.status(404).json({ error: 'Client not found or unauthorized' });
        }
        res.json(client);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};