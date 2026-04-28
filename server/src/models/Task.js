const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A task must have a title'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'A task must have a category'],
      enum: ['Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Development', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending',
    },
    deadline: {
      type: Date,
      required: [true, 'A task must have a deadline'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Dynamic Priority calculation is handled in the service/controller layer as requested
// but we can add an index for better performance on common queries
taskSchema.index({ user: 1, status: 1, deadline: 1 });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ deadline: 1 });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
