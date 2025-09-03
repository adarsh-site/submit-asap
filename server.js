import express from 'express';
import "dotenv/config";
import rateLimit from 'express-rate-limit'

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(limiter);
app.use(express.json());

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});