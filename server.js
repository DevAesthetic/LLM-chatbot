import express from 'express';
import cors from 'cors';
import session from 'express-session';
import routes from './routes/routes.js';
import modelsRouter from './routes/models.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(session({
    secret: 'chatbot_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

app.use(express.static('public'));
app.use('/api', routes);
app.use('/model', modelsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
