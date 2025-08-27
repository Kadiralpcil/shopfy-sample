import express from 'express';
import cors from 'cors';
import routes from './routes';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/public', express.static(path.join(__dirname, '../public')));

app.use('/api', routes);

app.get('/api/test', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is alive' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});