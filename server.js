import express from 'express';
import "dotenv/config";
import rateLimit from 'express-rate-limit'

import connectDB from "./config/db.js"
import userRouter from "./routes/userRoutes.js"
import adminRouter from "./routes/adminRoutes.js"

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

app.use("/user", userRouter);
app.use("/admin", adminRouter);

await connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});