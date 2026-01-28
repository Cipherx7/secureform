import dbConnect from '../../../../../lib/mongodb';
import Application from '../../../../../models/Application';
import { verifyAdmin, unauthorizedResponse } from '../../../../../lib/auth-utils';

export async function GET(request) {
  if (!await verifyAdmin(request)) return unauthorizedResponse();

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const status = searchParams.get('status') || 'all';
    const role = searchParams.get('role') || 'all';

    // Build filter
    const filter = {};
    if (status !== 'all') {
      filter.status = status;
    }
    if (role !== 'all') {
      filter.contributionAreas = { $in: [role] };
    }

    const applications = await Application.find(filter).sort({ submittedAt: -1 });

    if (format === 'json') {
      return new Response(JSON.stringify(applications, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="applications_${new Date().toISOString().split('T')[0]}.json"`
        }
      });
    }

    // CSV format
    const csvHeaders = [
      'Name', 'Email', 'Phone', 'Current Status', 'Education', 'Specialization',
      'Experience', 'Skill Level', 'Domain Interests', 'Contribution Areas',
      'Why Join CyberX', 'Status', 'Submitted At'
    ];

    const csvRows = applications.map(app => [
      app.fullName || '',
      app.email || '',
      app.whatsappNumber || '',
      app.currentStatus || '',
      app.highestQualification || '',
      app.specialization || '',
      app.experience || '',
      app.skillLevel || '',
      (app.domainInterests || []).join('; '),
      (app.contributionAreas || []).join('; '),
      app.whyJoinCyberX || '',
      app.status || '',
      app.submittedAt ? new Date(app.submittedAt).toLocaleString() : ''
    ]);

    const csvContent = [csvHeaders, ...csvRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return new Response(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="applications_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error('Export error:', error);
    return Response.json(
      { error: 'Failed to export applications' },
      { status: 500 }
    );
  }
}
