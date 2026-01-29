import dbConnect from '../../../../../lib/mongodb';
import Application from '../../../../../models/Application';
import { verifyAdmin, unauthorizedResponse } from '../../../../../lib/auth-utils';
import { del } from '@vercel/blob';

async function checkAuth(req) {
  const isAuthorized = await verifyAdmin(req);
  if (!isAuthorized) return false;
  return true;
}

export async function GET(request, { params }) {
  if (!await checkAuth(request)) return unauthorizedResponse();
  try {
    await dbConnect();

    // Next.js 15+ requires awaiting params
    const { id } = await params;
    const application = await Application.findById(id);

    if (!application) {
      return Response.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return Response.json(application);
  } catch (error) {
    console.error('Fetch application error:', error);
    return Response.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  if (!await checkAuth(request)) return unauthorizedResponse();
  try {
    await dbConnect();

    const { id } = await params;
    const updateData = await request.json();

    const application = await Application.findByIdAndUpdate(
      id,
      {
        ...updateData,
        lastUpdated: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return Response.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return Response.json({
      message: 'Application updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application error:', error);
    return Response.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  if (!await checkAuth(request)) return unauthorizedResponse();
  try {
    await dbConnect();

    const { id } = await params;
    const { status } = await request.json();

    const validStatuses = ['pending', 'shortlisted', 'selected', 'rejected', 'approved'];

    if (!status || !validStatuses.includes(status)) {
      return Response.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const application = await Application.findByIdAndUpdate(
      id,
      {
        status,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return Response.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return Response.json({
      message: 'Application status updated successfully',
      application
    });
  } catch (error) {
    console.error('Update application status error:', error);
    return Response.json(
      { error: 'Failed to update application status' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  if (!await checkAuth(request)) return unauthorizedResponse();
  try {
    await dbConnect();

    const { id } = await params;

    // Find application first to get resume path
    const application = await Application.findById(id);

    if (!application) {
      return Response.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Delete resume file from Vercel Blob if it exists
    if (application.resumePath) {
      try {
        // resumePath should be the full blob URL
        await del(application.resumePath);
        console.log(`Deleted resume blob: ${application.resumePath}`);
      } catch (err) {
        console.error('Error deleting resume blob:', err);
      }
    }

    // Delete from database
    await Application.findByIdAndDelete(id);

    return Response.json({
      message: 'Application and associated files deleted successfully'
    });
  } catch (error) {
    console.error('Delete application error:', error);
    return Response.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    );
  }
}
