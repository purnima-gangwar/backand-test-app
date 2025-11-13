import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import adminTokenRoutes from './routes/adminToken.js';
import userRoutes from './routes/users.js';
import { setupSwagger } from './swagger.js';

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', adminTokenRoutes);
app.use('/', adminRoutes);

// Swagger
setupSwagger(app);

// Admin panel
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files under /panel so panel.html can load its JS/CSS
app.use('/panel', express.static(path.join(__dirname, 'public')));

app.get('/panel', (req, res) => res.sendFile(path.join(__dirname, 'public', 'panel.html')));

// Root - Redirect to Swagger
app.get('/', (req,res) => res.redirect('/swagger'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server ${PORT} portda`));
