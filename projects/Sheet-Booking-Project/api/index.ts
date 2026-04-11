import { createApplication } from '../src/app';
import { connectDB } from '../src/db/connection';

const app = createApplication();

// Entry point middleware to ensure DB connection
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

export default app;
