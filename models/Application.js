import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  // Personal Information
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  whatsappNumber: {
    type: String,
    required: true,
    trim: true
  },

  // Academic Information (repurposed for CyberX)
  branch: {
    type: String,
    required: true,
    trim: true,
    comment: 'College / Organization name'
  },
  year: {
    type: String,
    required: true,
    trim: true,
    comment: 'Year of study or work experience'
  },

  // Role Preferences
  primaryRole: {
    type: String,
    required: true,
    trim: true
  },
  secondaryRole: {
    type: String,
    trim: true
  },

  // Experience and Motivation
  whyThisRole: {
    type: String,
    trim: true,
    comment: 'Why join CyberX Community'
  },
  pastExperience: {
    type: mongoose.Schema.Types.Mixed,
    comment: 'Detailed experience and background information'
  },

  // Other Activities
  hasOtherClubs: {
    type: String,
    trim: true,
    comment: 'CTF participation'
  },

  // Availability
  timeAvailability: {
    type: String,
    trim: true,
    comment: 'Current status'
  },

  // Resume file path
  resumePath: {
    type: String,
    trim: true,
    comment: 'Path to uploaded resume file'
  },

  // Metadata for new form fields (flexible storage)
  metadata: {
    currentStatus: String,
    cityState: String,
    highestQualification: String,
    specialization: String,
    skillLevel: String,
    handsOnDuration: String,
    domainInterests: [String],
    platformsUsed: String,
    profileLinks: String,
    ctfParticipation: String,
    ctfAchievements: String,
    projectsDescription: String,
    portfolioLink: String,
    followsEthics: String,
    unauthorizedTesting: String,
    unauthorizedExplanation: String,
    contributionAreas: [String],
    declarationAccepted: Boolean
  },

  // Admin Fields
  status: {
    type: String,
    enum: ['pending', 'shortlisted', 'selected', 'rejected'],
    default: 'pending'
  },
  adminRemarks: {
    type: String,
    trim: true
  },
  feedback: {
    type: String,
    trim: true
  },

  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Performance indexes for production-scale queries
ApplicationSchema.index({ email: 1 }, { unique: true });
ApplicationSchema.index({ whatsappNumber: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ submittedAt: -1 });
ApplicationSchema.index({ branch: 1 });
ApplicationSchema.index({ year: 1 });
ApplicationSchema.index({ primaryRole: 1 });
ApplicationSchema.index({ secondaryRole: 1 });
ApplicationSchema.index({ resumePath: 1 });

// Compound indexes for common admin queries
ApplicationSchema.index({ status: 1, submittedAt: -1 });
ApplicationSchema.index({ primaryRole: 1, status: 1 });
ApplicationSchema.index({ branch: 1, status: 1 });
ApplicationSchema.index({ 'metadata.currentStatus': 1, status: 1 });
ApplicationSchema.index({ 'metadata.skillLevel': 1, status: 1 });
ApplicationSchema.index({ 'metadata.domainInterests': 1, status: 1 });

// Text search index for admin search functionality
ApplicationSchema.index({
  fullName: 'text',
  email: 'text',
  whatsappNumber: 'text',
  branch: 'text',
  primaryRole: 'text',
  'metadata.highestQualification': 'text',
  'metadata.specialization': 'text',
  'metadata.projectsDescription': 'text'
});

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
