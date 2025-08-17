import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
