import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/users', (req,res)=>{
  const users = User.getAll().map(u=>({ id:u.id, username:u.username, email:u.email }));
  res.json({ users });
});

export default router;
