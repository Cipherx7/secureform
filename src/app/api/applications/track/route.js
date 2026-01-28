import dbConnect from '../../../../../lib/mongodb';
import Application from '../../../../../models/Application';
import { verifyAdmin, unauthorizedResponse } from '../../../../../lib/auth-utils';

export async function POST(request) {
  if (!await verifyAdmin(request)) return unauthorizedResponse();

  try {
    await dbConnect();

    const { applicationId, action } = await request.json();

    if (!applicationId || !action) {
      return Response.json(
        { error: 'Application ID and action are required' },
        { status: 400 }
      );
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      return Response.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Log the tracking action
    console.log(`Application ${applicationId} ${action} at ${new Date().toISOString()}`);

    return Response.json({
      message: 'Action tracked successfully',
      applicationId,
      action,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Track error:', error);
    return Response.json(
      { error: 'Failed to track action' },
      { status: 500 }
    );
  }
}
