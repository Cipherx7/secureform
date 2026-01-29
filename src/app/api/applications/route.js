import dbConnect from '../../../../lib/mongodb';
import Application from '../../../../models/Application';
import { put } from '@vercel/blob';
import { verifyAdmin, unauthorizedResponse } from '../../../../lib/auth-utils';

// Simple in-memory rate limiting store
const rateLimitStore = new Map();

// Rate limiting: 1 submission per IP per 5 minutes
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 5 * 60 * 1000; // 5 minutes
  const maxRequests = 1;

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  const record = rateLimitStore.get(ip);

  if (now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count++;
  return true;
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60000); // Clean every minute

export async function POST(request) {
  try {
    await dbConnect();

    const formData = await request.formData();

    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Rate limiting check
    if (!checkRateLimit(ip)) {
      return Response.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Extract form data
    const data = {};
    const resumeFile = formData.get('resumeFile');

    // Handle all form fields
    for (const [key, value] of formData.entries()) {
      if (key === 'resumeFile') continue;
      if (key.endsWith('[]')) {
        // Handle array fields
        const arrayKey = key.slice(0, -2);
        if (!data[arrayKey]) data[arrayKey] = [];
        data[arrayKey].push(value);
      } else {
        data[key] = value;
      }
    }

    // Honeypot check - reject if hidden field is filled
    if (data.companyWebsite && data.companyWebsite.trim() !== '') {
      // Silent rejection for bots
      return Response.json(
        { error: 'Invalid submission' },
        { status: 400 }
      );
    }

    // Remove honeypot field from data
    delete data.companyWebsite;

    // Check if application with this email already exists
    const existingApplication = await Application.findOne({
      email: data.email.toLowerCase()
    });

    if (existingApplication) {
      return Response.json(
        { error: 'An application with this email already exists' },
        { status: 400 }
      );
    }

    // Handle resume file upload
    let resumePath = null;
    if (resumeFile && resumeFile.size > 0) {
      /* 
         VERCEL BLOB INTEGRATION 
         Replaces local fs.writeFile which doesn't work in serverless
      */
      const timestamp = Date.now();
      // Sanitize email for filename
      const safeEmail = data.email.replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `resumes/${safeEmail}_${timestamp}.pdf`;

      // Upload to Vercel Blob
      const blob = await put(filename, resumeFile, {
        access: 'public',
      });

      resumePath = blob.url; // Store the public URL
    }

    // Map new form fields to existing schema
    const processedData = {
      fullName: data.fullName,
      email: data.email.toLowerCase(),
      whatsappNumber: data.whatsappNumber,
      branch: data.organizationName,
      year: data.yearOfStudyOrWorkExp,
      primaryRole: data.contributionAreas?.[0] || '',
      secondaryRole: data.contributionAreas?.[1] || '',
      whyThisRole: data.whyJoinCyberX || '',
      pastExperience: {
        currentStatus: data.currentStatus,
        cityState: data.cityState,
        highestQualification: data.highestQualification,
        specialization: data.specialization,
        skillLevel: data.skillLevel,
        handsOnDuration: data.handsOnDuration,
        domainInterests: data.domainInterests || [],
        platformsUsed: data.platformsUsed || '',
        profileLinks: data.profileLinks || '',
        ctfParticipation: data.ctfParticipation || '',
        ctfAchievements: data.ctfAchievements || '',
        projectsDescription: data.projectsDescription || '',
        portfolioLink: data.portfolioLink || '',
        followsEthics: data.followsEthics || '',
        unauthorizedTesting: data.unauthorizedTesting || '',
        unauthorizedExplanation: data.unauthorizedExplanation || ''
      },
      hasOtherClubs: data.ctfParticipation || '',
      timeAvailability: data.currentStatus || '',
      resumePath: resumePath || '',
      // Store all new fields in a metadata object for future use
      metadata: {
        currentStatus: data.currentStatus,
        cityState: data.cityState,
        highestQualification: data.highestQualification,
        specialization: data.specialization,
        skillLevel: data.skillLevel,
        handsOnDuration: data.handsOnDuration,
        domainInterests: data.domainInterests || [],
        platformsUsed: data.platformsUsed || '',
        profileLinks: data.profileLinks || '',
        ctfParticipation: data.ctfParticipation || '',
        ctfAchievements: data.ctfAchievements || '',
        projectsDescription: data.projectsDescription || '',
        portfolioLink: data.portfolioLink || '',
        followsEthics: data.followsEthics || '',
        unauthorizedTesting: data.unauthorizedTesting || '',
        unauthorizedExplanation: data.unauthorizedExplanation || '',
        contributionAreas: data.contributionAreas || [],
        declarationAccepted: data.declarationAccepted || false
      }
    };

    const application = new Application(processedData);
    await application.save();

    return Response.json(
      {
        message: 'Application submitted successfully',
        applicationId: application._id
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Application submission error:', error);
    return Response.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  if (!await verifyAdmin(request)) return unauthorizedResponse();

  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (role) {
      filter.$or = [
        { primaryRole: { $regex: role, $options: 'i' } },
        { secondaryRole: { $regex: role, $options: 'i' } }
      ];
    }
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { whatsappNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const applications = await Application.find(filter)
      .sort({ submittedAt: -1 });

    const total = applications.length;

    return Response.json({
      applications,
      total
    });
  } catch (error) {
    console.error('Fetch applications error:', error);
    return Response.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
