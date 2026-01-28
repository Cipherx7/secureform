import dbConnect from '../../../../../lib/mongodb';
import Application from '../../../../../models/Application';
import { verifyAdmin, unauthorizedResponse } from '../../../../../lib/auth-utils';

export async function GET(request) {
  if (!await verifyAdmin(request)) return unauthorizedResponse();

  try {
    await dbConnect();

    const stats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Application.countDocuments();

    const result = {
      total,
      pending: 0,
      shortlisted: 0,
      selected: 0,
      rejected: 0,
      approved: 0
    };

    stats.forEach(stat => {
      result[stat._id] = stat.count;
    });

    return Response.json(result);

  } catch (error) {
    console.error('Stats error:', error);
    return Response.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
