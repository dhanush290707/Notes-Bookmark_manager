import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
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
NoteSchema.index({ title: 'text', content: 'text' });

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
