import mongoose from 'mongoose';
import crypto from 'crypto';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    salt: {
        type: String,
        select: false
    }
}, {
    timestamps: true
});

// Hash password before saving using crypto (Node.js built-in)
UserSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.password = crypto.pbkdf2Sync(this.password, this.salt, 10000, 64, 'sha512').toString('hex');
        next();
    } catch (err) {
        next(err);
    }
});

// Compare password method
UserSchema.methods.comparePassword = function (candidatePassword) {
    const hash = crypto.pbkdf2Sync(candidatePassword, this.salt, 10000, 64, 'sha512').toString('hex');
    return this.password === hash;
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
