"use client";

import { useState } from 'react';
import Image from 'next/image';

const DOMAIN_INTERESTS = [
  'Web Application Security',
  'Network Security',
  'SOC / Blue Team',
  'Red Team / Penetration Testing',
  'Cloud Security',
  'Malware Analysis',
  'Digital Forensics',
  'Bug Bounty',
  'GRC / Compliance',
  'Threat Intelligence'
];

const CONTRIBUTION_ROLES = [
  'SOC / Blue Team',
  'Red Team / Pentesting',
  'Research & Threat Analysis',
  'Tool Development / Automation',
  'Content & Documentation',
  'Social Media, Graphics Design & Video Editing',
  'Community Management',
  'Events & Workshops Support',
  'Cyber Awareness & Training'
];

/* --- OPTIONS CONSTANTS --- */
const QUALIFICATION_OPTIONS = [
  'Diploma',
  'B.E. / B.Tech',
  'B.Sc',
  'BCA',
  'M.E. / M.Tech',
  'M.Sc',
  'MCA',
  'Certification-Only (No formal degree)',
  'Other (Please specify)'
];

const BRANCH_OPTIONS = [
  'Computer Science Engineering (CSE)',
  'Information Technology (IT)',
  'Cyber Security',
  'Artificial Intelligence and Data Science',
  'Artificial Intelligence & Machine Learning',
  'Electronics & Telecommunication (ENTC)',
  'Electronics Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Computer Science',
  'Mathematics',
  'Physics',
  'Statistics',
  'Non-Technical Background',
  'Career Transition / Domain Shift',
  'Other (Please specify)'
];

const YEAR_OPTIONS_STUDENT = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year'
];

const YEAR_OPTIONS_PROFESSIONAL = [
  'Fresher (0–1 year)',
  '1–2 years',
  '2–3 years',
  '3–5 years',
  '5+ years'
];

const YEAR_OPTIONS_SELF = [
  'Less than 6 months',
  '6 months – 1 year',
  '1–2 years',
  '2+ years',
  'Other (Please specify)'
];

const toggleInArray = (arr, value) =>
  arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

export default function CyberXHiring() {
  const [ui, setUi] = useState({
    fullName: '',
    email: '',
    whatsappNumber: '',
    cityState: '',
    organizationName: '',

    currentStatus: '', // Student | Working Professional | Self-Learner

    highestQualification: '',
    highestQualificationCustom: '', // New field for "Other"

    specialization: '',
    specializationCustom: '', // New field for "Other"

    yearOfStudyOrWorkExp: '',
    yearOfStudyCustom: '', // New field for "Other"

    skillLevel: '',
    handsOnDuration: '',

    domainInterests: [],

    platformsUsed: '',
    profileLinks: '',
    ctfParticipation: '',
    ctfAchievements: '',

    projectsDescription: '',
    portfolioLink: '',

    followsEthics: '',
    unauthorizedTesting: '',
    unauthorizedExplanation: '',
    whyJoinCyberX: '',

    contributionAreas: [],

    resumeFile: null,
    declarationAccepted: false,

    companyWebsite: '' // honeypot
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  /* ---------- DUPLICATE SUBMISSION Logic Preserved ---------- */
  const duplicateKey = `${ui.email}_${ui.whatsappNumber}`;

  /* ---------- VALIDATION Logic Preserved ---------- */
  const validate = () => {
    const e = {};

    if (!ui.fullName) e.fullName = 'Required';
    if (!ui.email) e.email = 'Required';
    if (!ui.whatsappNumber) e.whatsappNumber = 'Required';
    if (!ui.cityState) e.cityState = 'Required';
    if (!ui.organizationName) e.organizationName = 'Required';

    if (!ui.currentStatus) e.currentStatus = 'Required';

    if (!ui.highestQualification) e.highestQualification = 'Required';
    if (ui.highestQualification === 'Other (Please specify)' && !ui.highestQualificationCustom) {
      e.highestQualificationCustom = 'Please specify your qualification';
    }

    if (!ui.specialization) e.specialization = 'Required';
    if (ui.specialization === 'Other (Please specify)' && !ui.specializationCustom) {
      e.specializationCustom = 'Please specify your branch/specialization';
    }

    if (!ui.yearOfStudyOrWorkExp) e.yearOfStudyOrWorkExp = 'Required';
    if (ui.yearOfStudyOrWorkExp === 'Other (Please specify)' && !ui.yearOfStudyCustom) {
      e.yearOfStudyCustom = 'Please specify your experience';
    }

    if (!ui.skillLevel) e.skillLevel = 'Required';
    if (!ui.handsOnDuration) e.handsOnDuration = 'Required';
    if (!ui.domainInterests.length) e.domainInterests = 'Select at least one';

    if (!ui.projectsDescription) e.projectsDescription = 'Required';

    // Conditional ethics validation
    if (!ui.followsEthics) e.followsEthics = 'Required';
    if (!ui.unauthorizedTesting) e.unauthorizedTesting = 'Required';
    if (ui.unauthorizedTesting === 'Yes' && ui.unauthorizedExplanation.length < 20)
      e.unauthorizedExplanation = 'Minimum 20 characters';

    if (!ui.whyJoinCyberX || ui.whyJoinCyberX.length < 20)
      e.whyJoinCyberX = 'Minimum 20 characters';

    if (!ui.contributionAreas.length) e.contributionAreas = 'Select at least one role';

    if (!ui.resumeFile) {
      e.resumeFile = 'Resume is required';
    } else if (ui.resumeFile.type !== 'application/pdf') {
      e.resumeFile = 'Only PDF allowed';
    } else if (ui.resumeFile.size > 2 * 1024 * 1024) {
      e.resumeFile = 'Max size 2MB';
    }

    if (!ui.declarationAccepted) e.declarationAccepted = 'Required';

    return e;
  };

  /* ---------- HANDLERS ---------- */
  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setUi(prev => {
      const newState = {
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
      };

      // Reset dependent fields if Status changes
      if (name === 'currentStatus') {
        newState.yearOfStudyOrWorkExp = ''; // Reset year selection
        newState.yearOfStudyCustom = '';
      }

      return newState;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSuccess(false);

    if (typeof window !== 'undefined' && localStorage.getItem(duplicateKey)) {
      setSubmitError('You have already submitted an application.');
      return;
    }

    const v = validate();
    setErrors(v);
    setTouched(Object.keys(ui).reduce((a, k) => ({ ...a, [k]: true }), {}));
    if (Object.keys(v).length) return;

    const formData = new FormData();

    Object.entries(ui).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => formData.append(`${key}[]`, v));
      } else if (value !== null) {
        formData.append(key, value);
      }
    });

    setLoading(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error();

      localStorage.setItem(duplicateKey, 'submitted');
      setSuccess(true);
    } catch {
      setSubmitError('Submission failed. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fe = (n) => touched[n] && errors[n];

  /* ---------- HELPER FOR YEAR OPTIONS ---------- */
  const getYearOptions = () => {
    switch (ui.currentStatus) {
      case 'Student': return YEAR_OPTIONS_STUDENT;
      case 'Working Professional': return YEAR_OPTIONS_PROFESSIONAL;
      case 'Self-Learner': return YEAR_OPTIONS_SELF;
      default: return [];
    }
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-12">
      <main className="w-full max-w-4xl">

        {/* Header / Logo */}
        {/* Logo - Top Left Absolute */}
        {/* Logo - Mobile: Centered Relative | Desktop: Top-Left Absolute */}
        <div className="relative mx-auto mt-8 mb-4 w-72 h-24 md:absolute md:top-8 md:left-12 md:m-0 md:w-96 md:h-32 z-20">
          <Image
            src="/assets/logo.png"
            alt="CyberX Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Center Header Text */}
        <div className="flex flex-col items-center mb-16 pt-4 md:pt-16">
          <h2 className="text-xl md:text-2xl font-poppins font-semibold text-white text-center mb-1 tracking-wide">
            Become a Part of
          </h2>
          <h1 className="text-3xl md:text-5xl font-poppins font-extrabold text-white text-center mb-4 tracking-tight">
            CYBER<span className="text-cyber-yellow">X</span> Community
          </h1>
          <p className="text-[#B3B3B3] text-center max-w-lg text-sm md:text-base font-medium">
            Connecting motivated learners and practitioners in cybersecurity.
          </p>
        </div>

        {/* Professional Card */}
        <div className="pro-card rounded-2xl p-6 md:p-12 mb-20 relative overflow-hidden">
          {/* Top Yellow Bar Decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-yellow to-transparent opacity-50"></div>

          <form onSubmit={onSubmit} className="space-y-12">

            {/* Honeypot */}
            <input
              type="text"
              name="companyWebsite"
              value={ui.companyWebsite}
              onChange={onChange}
              className="hidden"
            />

            <Section title="Personal Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Field label="Full Name" required error={fe('fullName')}>
                  <Input name="fullName" value={ui.fullName} onChange={onChange} placeholder="John Doe" />
                </Field>
                <Field label="Email Address" required error={fe('email')}>
                  <Input name="email" value={ui.email} onChange={onChange} placeholder="john@example.com" type="email" />
                </Field>
                <Field label="Mobile / WhatsApp Number" required error={fe('whatsappNumber')}>
                  <Input name="whatsappNumber" value={ui.whatsappNumber} onChange={onChange} placeholder="+91 98765 43210" />
                </Field>
                <Field label="City & State" required error={fe('cityState')}>
                  <Input name="cityState" value={ui.cityState} onChange={onChange} placeholder="Nashik, Maharashtra" />
                </Field>
                <Field label="College / Organization Name" required error={fe('organizationName')} className="md:col-span-2">
                  <Input name="organizationName" value={ui.organizationName} onChange={onChange} placeholder="Enter your college or organization name" />
                </Field>
              </div>
            </Section>

            <Section title="Current Status & Education">
              {/* CURRENT STATUS */}
              <div className="mb-6">
                <RadioRow
                  label="Current Status"
                  name="currentStatus"
                  value={ui.currentStatus}
                  onChange={onChange}
                  error={fe('currentStatus')}
                  options={['Student', 'Working Professional', 'Self-Learner']}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                {/* HIGHEST QUALIFICATION */}
                <div className="flex flex-col gap-2">
                  <Field label="Highest Qualification" required error={fe('highestQualification')}>
                    <Select name="highestQualification" value={ui.highestQualification} onChange={onChange}>
                      <option value="">Select Qualification</option>
                      {QUALIFICATION_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </Select>
                  </Field>
                  {ui.highestQualification === 'Other (Please specify)' && (
                    <Field label="Please specify your qualification" required error={fe('highestQualificationCustom')}>
                      <Input name="highestQualificationCustom" value={ui.highestQualificationCustom} onChange={onChange} />
                    </Field>
                  )}
                </div>

                {/* BRANCH / SPECIALIZATION */}
                <div className="flex flex-col gap-2">
                  <Field label="Branch / Specialization" required error={fe('specialization')}>
                    <Select name="specialization" value={ui.specialization} onChange={onChange}>
                      <option value="">Select Branch</option>
                      {BRANCH_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </Select>
                  </Field>
                  {ui.specialization === 'Other (Please specify)' && (
                    <Field label="Please specify your branch" required error={fe('specializationCustom')}>
                      <Input name="specializationCustom" value={ui.specializationCustom} onChange={onChange} />
                    </Field>
                  )}
                </div>

                {/* YEAR OF STUDY / EXPERIENCE */}
                {ui.currentStatus && (
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <Field label="Year of Study / Experience" required error={fe('yearOfStudyOrWorkExp')}>
                      <Select name="yearOfStudyOrWorkExp" value={ui.yearOfStudyOrWorkExp} onChange={onChange}>
                        <option value="">Select Option</option>
                        {getYearOptions().map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </Select>
                    </Field>
                    {ui.yearOfStudyOrWorkExp === 'Other (Please specify)' && (
                      <Field label="Please specify your experience" required error={fe('yearOfStudyCustom')}>
                        <Input name="yearOfStudyCustom" value={ui.yearOfStudyCustom} onChange={onChange} />
                      </Field>
                    )}
                  </div>
                )}

              </div>
            </Section>

            <Section title="Cybersecurity Experience">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Field label="Skill Level" required error={fe('skillLevel')}>
                  <Select name="skillLevel" value={ui.skillLevel} onChange={onChange}>
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </Select>
                </Field>
                <Field label="Hands-on Experience Duration" required error={fe('handsOnDuration')}>
                  <Input name="handsOnDuration" value={ui.handsOnDuration} onChange={onChange} placeholder="e.g. 6 months" />
                </Field>
              </div>
            </Section>

            <Section title="Cybersecurity Domain Interests">
              <CheckboxGrid
                values={ui.domainInterests}
                options={DOMAIN_INTERESTS}
                onToggle={(value) => {
                  setUi(prev => ({ ...prev, domainInterests: toggleInArray(prev.domainInterests, value) }));
                  if (errors.domainInterests) setErrors(prev => ({ ...prev, domainInterests: undefined }));
                }}
                error={fe('domainInterests')}
              />
            </Section>

            <Section title="Practical Exposure">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <Field label="Learning platforms used" required error={fe('platformsUsed')}>
                  <Input name="platformsUsed" value={ui.platformsUsed} onChange={onChange} placeholder="e.g. TryHackMe, HackTheBox, PortSwigger" />
                </Field>
                <Field label="Profile links" error={fe('profileLinks')}>
                  <Input name="profileLinks" value={ui.profileLinks} onChange={onChange} placeholder="LinkedIn, GitHub, or Portfolio URL" />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-6 mt-6">
                <Field label="Project Description" required error={fe('projectsDescription')}>
                  <Textarea name="projectsDescription" value={ui.projectsDescription} onChange={onChange} placeholder="Briefly describe a security-related project you've worked on." />
                </Field>
                <Field label="Portfolio Link (Optional)" error={fe('portfolioLink')}>
                  <Input name="portfolioLink" value={ui.portfolioLink} onChange={onChange} placeholder="Link to additional work" />
                </Field>
              </div>

              <div className="mt-8 pt-6 border-t border-cyber-border">
                <RadioRow
                  label="Have you participated in CTFs?"
                  name="ctfParticipation"
                  value={ui.ctfParticipation}
                  onChange={onChange}
                  error={fe('ctfParticipation')}
                  options={['Yes', 'No']}
                />

                {ui.ctfParticipation === 'Yes' && (
                  <div className="mt-6 animate-fade-in">
                    <Field label="CTF details" required error={fe('ctfAchievements')}>
                      <Textarea
                        name="ctfAchievements"
                        value={ui.ctfAchievements}
                        onChange={onChange}
                        placeholder="Please mention specific CTFs, your rank, team name, and any notable achievements." />
                    </Field>
                  </div>
                )}
              </div>
            </Section>

            <Section title="Motivation to Join CyberX">
              <div className="grid grid-cols-1 gap-6 mb-8 p-6 bg-cyber-black/20 rounded-lg border border-cyber-border/50">
                <RadioRow
                  label="Do you follow ethical cybersecurity practices?"
                  name="followsEthics"
                  value={ui.followsEthics}
                  onChange={onChange}
                  error={fe('followsEthics')}
                  options={['Yes', 'No']}
                />
                <RadioRow
                  label="Have you ever performed unauthorized testing?"
                  name="unauthorizedTesting"
                  value={ui.unauthorizedTesting}
                  onChange={onChange}
                  error={fe('unauthorizedTesting')}
                  options={['Yes', 'No']}
                />
                {ui.unauthorizedTesting === 'Yes' && (
                  <Field label="Explanation" required error={fe('unauthorizedExplanation')}>
                    <Textarea
                      name="unauthorizedExplanation"
                      value={ui.unauthorizedExplanation}
                      onChange={onChange}
                      placeholder="Please explain the context of the unauthorized testing."
                    />
                  </Field>
                )}
              </div>

              <Field label="Why do you want to join CyberX?" required error={fe('whyJoinCyberX')}>
                <Textarea
                  name="whyJoinCyberX"
                  value={ui.whyJoinCyberX}
                  onChange={onChange}
                  rows={5}
                  placeholder="Share your motivation, career goals, and what you hope to contribute to the community." />
              </Field>
            </Section>

            <Section title="Contribution Areas">
              <CheckboxGrid
                values={ui.contributionAreas}
                options={CONTRIBUTION_ROLES}
                onToggle={(value) => {
                  setUi(prev => ({ ...prev, contributionAreas: toggleInArray(prev.contributionAreas, value) }));
                  if (errors.contributionAreas) setErrors(prev => ({ ...prev, contributionAreas: undefined }));
                }}
                error={fe('contributionAreas')}
              />
            </Section>

            <Section title="Resume & Declaration">
              <Field label="Resume Upload" required error={fe('resumeFile')}>
                <div className="relative border border-dashed border-cyber-border-hover rounded-lg p-8 text-center hover:bg-cyber-card/50 transition-colors">
                  <input
                    type="file"
                    name="resumeFile"
                    accept=".pdf"
                    onChange={onChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyber-text-muted mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-medium text-cyber-text-secondary">
                      {ui.resumeFile ? <span className="text-cyber-yellow">{ui.resumeFile.name}</span> : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-cyber-text-muted mt-1">PDF only (Max 2MB)</p>
                  </div>
                </div>
              </Field>

              <div className="mt-8">
                <label className="flex items-start cursor-pointer group">
                  <div className="relative flex items-center pt-0.5">
                    <input
                      type="checkbox"
                      name="declarationAccepted"
                      checked={ui.declarationAccepted}
                      onChange={onChange}
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-cyber-border bg-cyber-card transition-all checked:border-cyber-yellow checked:bg-cyber-yellow"
                    />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-cyber-text-secondary group-hover:text-white transition-colors">
                    I confirm that information provided is true and I agree to follow ethical cybersecurity practices under CyberX.
                  </span>
                </label>
                {fe('declarationAccepted') && (
                  <div className="mt-2 text-red-500 text-sm">{fe('declarationAccepted')}</div>
                )}
              </div>
            </Section>

            {/* Messages */}
            {submitError && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center text-sm">
                {submitError}
              </div>
            )}

            {success && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-center text-sm">
                Application submitted successfully. We will contact you shortly.
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-cyber-yellow hover:bg-cyber-yellow-hover text-black font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </div>

          </form>
        </div>

        {/* Footer */}
        <footer className="text-center pb-8">
          <p className="text-cyber-text-muted text-sm">
            © 2026 CyberX Community — All rights reserved.
          </p>
        </footer>

      </main>
    </div>
  );
}

/* --- Clean Professional Components --- */

function Section({ title, children }) {
  return (
    <section>
      <div className="flex items-center mb-6">
        {/* Simple Yellow Accent Dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-cyber-yellow mr-3"></div>
        <h2 className="text-xl font-poppins font-semibold text-white tracking-tight">
          {title}
        </h2>
      </div>
      <div>
        {children}
      </div>
    </section>
  );
}

function Field({ label, required, error, children, className = '' }) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="mb-2 text-sm font-medium text-cyber-text-secondary">
        {label}
        {required && <span className="text-cyber-yellow ml-0.5">*</span>}
      </label>
      {children}
      {error && <div className="mt-1.5 text-red-500 text-xs font-medium">{error}</div>}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full bg-cyber-card border border-cyber-border rounded-lg px-4 py-3 text-white placeholder-cyber-text-muted/60
        focus:outline-none input-pro
        transition-all duration-200 text-sm"
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className="w-full bg-cyber-card border border-cyber-border rounded-lg px-4 py-3 text-white placeholder-cyber-text-muted/60
        focus:outline-none input-pro
        transition-all duration-200 text-sm min-h-[120px] resize-y"
    />
  );
}

function Select(props) {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full bg-cyber-card border border-cyber-border rounded-lg px-4 py-3 text-white appearance-none
          focus:outline-none input-pro
          transition-all duration-200 text-sm cursor-pointer"
      >
        {props.children}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-cyber-text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function CheckboxGrid({ options, values, onToggle, error }) {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map(opt => {
          const isSelected = values.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`flex items-center px-4 py-3 rounded-lg border transition-all duration-200 text-left
                ${isSelected
                  ? 'bg-cyber-card border-cyber-yellow/50 text-white'
                  : 'bg-cyber-card border-cyber-border text-cyber-text-muted hover:border-cyber-border-hover'
                }`}
            >
              <div className={`w-5 h-5 mr-3 rounded border flex items-center justify-center transition-all flex-shrink-0
                  ${isSelected ? 'bg-cyber-yellow border-cyber-yellow' : 'border-cyber-text-muted/40'}`}>
                {isSelected && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-black" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium">{opt}</span>
            </button>
          );
        })}
      </div>
      {error && <div className="mt-1.5 text-red-500 text-xs font-medium">{error}</div>}
    </div>
  );
}

function RadioRow({ name, value, options, onChange, error, label }) {
  return (
    <div>
      {label && <label className="mb-3 text-sm font-medium text-cyber-text-secondary block">{label}</label>}
      <div className="flex flex-wrap gap-4">
        {options.map(opt => (
          <label
            key={opt}
            className={`cursor-pointer px-5 py-2 rounded-full border transition-all duration-200 text-sm font-medium select-none
               ${value === opt
                ? 'bg-cyber-yellow text-black border-cyber-yellow'
                : 'bg-transparent text-cyber-text-muted border-cyber-border hover:border-cyber-text-muted'
              }`}
          >
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={onChange}
              className="hidden"
            />
            {opt}
          </label>
        ))}
      </div>
      {error && <div className="mt-1.5 text-red-500 text-xs font-medium">{error}</div>}
    </div>
  );
}
