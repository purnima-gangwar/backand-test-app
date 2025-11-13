import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

/**
 * @route POST /admin/login
 * @desc Admin login, token qaytaradi
 * @access Public
 */
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if(!username || !password)
    return res.status(400).json({ message:'Username va password kerak' });

  if(username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ message:'Invalid credentials' });

  const token = jwt.sign(
    { username },
    process.env.ADMIN_TOKEN_SECRET,
    { expiresIn: process.env.ADMIN_TOKEN_EXPIRY || '8h' }
  );

  res.json({ adminToken: token });
});

export default router;
