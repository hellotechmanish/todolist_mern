"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = __importDefault(require("./config/mongodb"));
const admin_1 = __importDefault(require("./routes/admin"));
const auth_1 = __importDefault(require("./routes/auth"));
const todo_1 = __importDefault(require("./routes/todo"));
dotenv_1.default.config();
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
    throw new Error('MONGO_URI is not defined in the environment');
}
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment');
}
void (0, mongodb_1.default)(mongoUri);
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 5000;
const clientOrigin = process.env.CLIENT_ORIGIN ?? 'http://localhost:5173';
app.use((0, cors_1.default)({
    origin: clientOrigin,
    credentials: true,
}));
app.use(express_1.default.json());
app.get('/', (_req, res) => {
    res.send('Hello, World! Your server is running.');
});
app.use('/api/auth', auth_1.default);
app.use('/api/todos', todo_1.default);
app.use('/api/admin', admin_1.default);
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
