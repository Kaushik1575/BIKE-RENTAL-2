const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Check for required environment variables
if (!process.env.JWT_SECRET || !process.env.ADMIN_SECURITY_CODE || !process.env.MONGODB_URI) {
    console.error('FATAL ERROR: One or more required environment variables (JWT_SECRET, ADMIN_SECURITY_CODE, MONGODB_URI) are missing.');
    process.exit(1);
}

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    console.log('Connected to MongoDB');

    // Check if vehicles collection is empty and seed if necessary
    const vehicleCount = await Vehicle.countDocuments();
    if (vehicleCount === 0) {
        console.log('Vehicles collection is empty. Seeding with default data...');
        const defaultVehicles = [
            {
                name: 'Standard Bike',
                type: 'Commuter',
                price: 15,
                description: 'A reliable bike for daily commuting.',
                status: 'available',
                mileage: 0,
                seats: 1
            },
            {
                name: 'Mountain Bike',
                type: 'Mountain',
                price: 25,
                description: 'Great for off-road adventures.',
                status: 'available',
                mileage: 0,
                seats: 1
            },
            {
                name: 'Scooter',
                type: 'Scooter',
                price: 20,
                description: 'Easy to ride around the city.',
                status: 'available',
                mileage: 0,
                seats: 1
            }
        ];
        try {
            await Vehicle.insertMany(defaultVehicles);
            console.log('Default vehicles seeded successfully.');
        } catch (seedErr) {
            console.error('Error seeding default vehicles:', seedErr);
        }
    } else {
        console.log(`Vehicles collection is not empty (${vehicleCount} documents found). Skipping seeding.`);
    }

}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    aadhar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    adminId: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Vehicle Schema
const vehicleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    status: { type: String, enum: ['available', 'maintenance', 'rented'], default: 'available' },
    mileage: { type: Number },
    seats: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ success: false, error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
    }
};

// Middleware to check admin role
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    next();
};

// User registration endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, aadhar, adminId, securityCode } = req.body;
        
        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !password) {
            return res.status(400).json({ 
                success: false,
                error: 'All required fields must be provided'
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                error: 'Email already registered' 
            });
        }
        
        // Handle admin registration
        if (adminId) {
            if (securityCode !== process.env.ADMIN_SECURITY_CODE) {
                return res.status(401).json({
                    success: false,
                    error: 'Invalid security code'
                });
            }

            // Validate admin ID format
            const adminIdRegex = /^ADM\d{4}$/;
            if (!adminIdRegex.test(adminId)) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid Admin ID format'
                });
            }

            // Check if admin ID already exists
            const existingAdmin = await User.findOne({ adminId });
            if (existingAdmin) {
                return res.status(400).json({
                    success: false,
                    error: 'Admin ID already exists'
                });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            phone,
            password: hashedPassword,
            aadhar,
            adminId,
            role: adminId ? 'admin' : 'user'
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful'
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            error: 'Registration failed'
        });
    }
});

// User login endpoint
app.post('/api/user-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid email or password'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

// Admin login endpoint
app.post('/api/admin-login', async (req, res) => {
    try {
        const { adminId, password, securityCode } = req.body;

        if (securityCode !== process.env.ADMIN_SECURITY_CODE) {
            return res.status(401).json({
                success: false,
                error: 'Invalid security code'
            });
        }

        // Find admin
        const admin = await User.findOne({ adminId, role: 'admin' });
        if (!admin) {
            return res.status(401).json({
                success: false,
                error: 'Invalid Admin ID or password'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid Admin ID or password'
            });
        }

        // Update last login
        admin.lastLogin = new Date();
        await admin.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: admin._id,
                email: admin.email,
                role: admin.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                name: `${admin.firstName} ${admin.lastName}`,
                email: admin.email,
                adminId: admin.adminId,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed'
        });
    }
});

// Protected routes
app.get('/api/vehicles', async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.json({
            success: true,
            vehicles
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: 'Failed to fetch vehicles' 
        });
    }
});

// Admin only routes
app.post('/api/vehicles', verifyToken, isAdmin, async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        await vehicle.save();
        res.status(201).json({
            success: true,
            vehicle
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to add vehicle'
        });
    }
});

// Serve static files if public directory exists
const fs = require('fs');
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
} else {
    console.warn('Warning: public directory does not exist. Static files will not be served.');
}

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 