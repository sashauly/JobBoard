import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/vacancy.routes';
import userRouter from './routes/user.routes';

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);
app.use('/users', userRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
