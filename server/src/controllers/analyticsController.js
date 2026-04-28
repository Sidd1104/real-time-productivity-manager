const mongoose = require('mongoose');
const Task = require('../models/Task');
const catchAsync = require('../utils/catchAsync');

exports.getStats = catchAsync(async (req, res, next) => {
  const userId = new mongoose.Types.ObjectId(req.user.id);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats = await Task.aggregate([
    {
      $match: { user: userId },
    },
    {
      $facet: {
        totalCounts: [
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              completed: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
              },
              pending: {
                $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
              },
              inProgress: {
                $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
              },
            },
          },
        ],
        completedToday: [
          {
            $match: {
              status: 'completed',
              updatedAt: { $gte: today },
            },
          },
          { $count: 'count' },
        ],
        categoryDistribution: [
          {
            $group: {
              _id: '$category',
              count: { $sum: 1 },
            },
          },
          { $sort: { count: -1 } },
        ],
      },
    },
  ]);

  const result = {
    total: stats[0].totalCounts[0]?.total || 0,
    completed: stats[0].totalCounts[0]?.completed || 0,
    pending: stats[0].totalCounts[0]?.pending || 0,
    inProgress: stats[0].totalCounts[0]?.inProgress || 0,
    completedToday: stats[0].completedToday[0]?.count || 0,
    topCategory: stats[0].categoryDistribution[0]?._id || 'N/A',
    categoryStats: stats[0].categoryDistribution,
  };

  res.status(200).json({
    status: 'success',
    data: result,
  });
});
