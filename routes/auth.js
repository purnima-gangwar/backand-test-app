import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Register
router.post('/auth/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ message: 'All fields required' });

        const existingUser = (await User.findByUsername?.(username)) || (await User.findByEmail?.(email));
        if (existingUser) return res.status(409).json({ message: 'User already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const created = await User.create?.({ username, email, password: hashed }) || null;
        if (!created) return res.status(500).json({ message: 'Could not create user' });

        const token = jwt.sign({ id: created.id, username: created.username }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ accessToken: token, user: { id: created.id, username: created.username, email: created.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ message: 'All fields required' });

        const user = (await User.findByUsername?.(username)) || (await User.findByEmail?.(username));
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ accessToken: token, user: { id: user.id, username: user.username, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
