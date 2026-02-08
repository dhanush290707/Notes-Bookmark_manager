import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: [true, 'URL is required'],
        trim: true,
        validate: {
            validator: function (v) {
                try {
                    new URL(v);
                    return true;
                } catch {
                    return false;
                }
            },
            message: 'Please enter a valid URL'
        }
    },
    title: {
        type: String,
        trim: true,
        maxlength: [300, 'Title cannot be more than 300 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    tags: [{
        type: String,
        trim: true,
        lowercase: true
    }],
    favorite: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for text search
BookmarkSchema.index({ title: 'text', description: 'text' });

export default mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);
