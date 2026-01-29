import dbConnect from '../../../../../lib/mongodb';
import Application from '../../../../../models/Application';
import { verifyAdmin, unauthorizedResponse } from '../../../../../lib/auth-utils';

async function checkAuth(req) {
  const isAuthorized = await verifyAdmin(req);
  if (!isAuthorized) return false;
  return true;
}

export async function GET(request, { params }) {
  if (!await checkAuth(request)) return unauthorizedResponse();
  try {
    await dbConnect();

    const { id } = params;
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

    const { id } = params;
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

    const { id } = params;
    const { status } = await request.json();

    if (!status || !['pending', 'shortlisted', 'selected', 'rejected'].includes(status)) {
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

import { join } from 'path';
import { unlink } from 'fs/promises';

export async function DELETE(request, { params }) {
  if (!await checkAuth(request)) return unauthorizedResponse();
  try {
    await dbConnect();

    const { id } = params;

    // Find application first to get resume path
    const application = await Application.findById(id);

    if (!application) {
      return Response.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // Delete resume file if it exists
    if (application.resumePath) {
      try {
        // resumePath is stored as "/resumes/filename.pdf"
        // We need to construct the full system path: process.cwd() + /public + resumePath
        const filePath = join(process.cwd(), 'public', application.resumePath);
        await unlink(filePath);
        console.log(`Deleted resume file: ${filePath}`);
      } catch (err) {
        // If file doesn't exist or other error, log it but continue with DB deletion
        console.error('Error deleting resume file:', err);
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
