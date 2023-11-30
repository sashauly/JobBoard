import express, { Application } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.get('/api/v1', (req, res) => {
  res.json({ message: 'Api v1' });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
