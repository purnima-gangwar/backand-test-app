import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname,'../data/users.json');

export default class User {
  static getAll(){
    if(!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }

  static saveAll(users){ fs.writeFileSync(filePath, JSON.stringify(users,null,2)); }

  static create({ username, email, password }){
    const users = this.getAll();
    const hashed = bcrypt.hashSync(password,10);
    const newUser = { id:uuidv4(), username, email, password:hashed };
    users.push(newUser);
    this.saveAll(users);
    return newUser;
  }

  static delete(id){
    let users = this.getAll();
    users = users.filter(u => u.id !== id);
    this.saveAll(users);
  }

  static findByUsername(username){
    return this.getAll().find(u=>u.username===username);
  }

  static findByEmail(email){
    return this.getAll().find(u=>u.email===email);
  }

  static findById(id){
    return this.getAll().find(u=>u.id===id);
  }
}
