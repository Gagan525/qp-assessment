"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signUp = exports.getUsers = void 0;
const connect_1 = __importDefault(require("./prisma/connect"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function getUsers(req, res) {
    res.status(200).send([]);
}
exports.getUsers = getUsers;
// Generate JWT token
const generateToken = (userId, email, isAdmin) => {
    const secret = process.env.SECRET;
    if (!secret) {
        throw new Error('Secret is not defined');
    }
    // return jwt.sign({ userId }, secret as Secret, { expiresIn: '1h' });
    return jsonwebtoken_1.default.sign({ userId, email, isAdmin }, secret);
};
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // Check if the email is already in use
    const existingUser = yield connect_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
    }
    // Hash the password
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    try {
        // Create the new user
        const newUser = yield connect_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
        const token = generateToken(newUser.id, newUser.email, newUser.isAdmin);
        res.status(201).json({ message: 'User registered successfully', user: newUser, token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Failed to register user' });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate request body
        if (!email || !password) {
            return res.status(500).json({ message: 'Email and password are required' });
        }
        // Find user by email
        const user = yield connect_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Compare passwords
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        // Generate JWT token
        const token = generateToken(user.id, user.email, user.isAdmin);
        // Respond with token
        res.status(200).json({ token, message: "Logged in successfully" });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
});
exports.login = login;
