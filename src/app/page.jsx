"use client";

import { useState, useEffect } from 'react';
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

const CONTRIBUTION_ROLES = [];


const STATUS_OPTIONS = [
  'I am a UG/PG student studying in Computer Science',
  'I am a UG/PG student studying in a non–computer science–related degree',
  'I am a working professional',
  'I have just passed out and am looking for a working opportunity'
];

const FAQ_DATA = [
  {
    question: "What is CyberX?",
    answer: "CyberX is a community driven by students and professionals dedicated to cybersecurity. We organize CTF competitions, workshops, and events to spread awareness, mentor students, and facilitate knowledge sharing."
  },
  {
    question: "Who can join CyberX?",
    answer: "Students, professionals, and enthusiasts who are passionate about cybersecurity and willing to contribute to the community can apply."
  },
  {
    question: "Is this an internship?",
    answer: "No, this is a volunteer community core team member role, not a formal corporate internship."
  },
  {
    question: "Is this a paid role?",
    answer: "No, this is not a paid position. However, core members get exclusive perks such as free access to paid events, conferences, and workshops hosted by partner communities and organizations."
  },
  {
    question: "What is the time commitment?",
    answer: "We expect active participation in community events and tasks, but it is flexible to accommodate your studies or work."
  },
  {
    question: "What CyberX have done from start?",
    answer: (
      <span>
        Please go through our{' '}
        <a href="https://cyberx.community" target="_blank" rel="noopener noreferrer" className="text-cyber-yellow hover:underline">
          website
        </a>{' '}
        and social media handles ({' '}
        <a href="https://www.linkedin.com/company/cyberx-community" target="_blank" rel="noopener noreferrer" className="text-cyber-yellow hover:underline">
          LinkedIn
        </a>
        ,{' '}
        <a href="https://www.instagram.com/cyberx_community" target="_blank" rel="noopener noreferrer" className="text-cyber-yellow hover:underline">
          Instagram
        </a>
        ,{' '}
        <a href="https://www.commudle.com/communities/cyberx" target="_blank" rel="noopener noreferrer" className="text-cyber-yellow hover:underline">
          Commudle
        </a>{' '}
        ) to know about our past events, CTFs, and community activities.
      </span>
    )
  }
];

const LEARNING_OPTIONS = [
  'I am learning through YouTube, blogs, Courses',
  'I am learning through TryHackMe, Hack The Box and other like platforms',
  'I have joined a training institute',
  'I have done certification from EC-Council, INE, OffSec, THM and others'
];

const toggleInArray = (arr, value) =>
  arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value];

export default function CyberXHiring() {
  const [ui, setUi] = useState({
    fullName: '',
    email: '',
    whatsappNumber: '',
    // cityState removed
    organizationName: '',

    statusDescription: '',





    domainInterests: [],
    domainLevels: {}, // { "Web Application Security": "Intermediate", ... }

    platformsUsed: [],
    certificationDetails: '',
    platformProfileLink: '',
    profileLinks: '',
    ctfParticipation: '',
    // ctfAchievements removed

    // projectsDescription removed
    // portfolioLink removed
    // Ethics fields removed
    whyJoinCyberX: '',

    contributionAreas: [],

    declarationAccepted: false,

    companyWebsite: '' // honeypot
  });

  const STORAGE_KEY = 'cyberx_form_draft';

  // Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUi(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to load draft', e);
      }
    }
  }, []);

  // Save state on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ui));
  }, [ui]);

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
    if (!ui.fullName) e.fullName = 'Required';
    if (!ui.email) e.email = 'Required';
    if (!ui.whatsappNumber) e.whatsappNumber = 'Required';
    // cityState validation removed
    if (!ui.organizationName) e.organizationName = 'Required';

    if (!ui.statusDescription) e.statusDescription = 'Required';
    if (!ui.platformsUsed.length) e.platformsUsed = 'Select at least one';
    if (ui.platformsUsed.includes('I have done certification from EC-Council, INE, OffSec, THM and others') && !ui.certificationDetails) {
      e.certificationDetails = 'Please specify your certifications';
    }
    if (!ui.profileLinks) e.profileLinks = 'Required';




    if (!ui.domainInterests.length) {
      e.domainInterests = 'Select at least one';
    } else {
      ui.domainInterests.forEach(interest => {
        if (!ui.domainLevels[interest]) {
          e[`level_${interest}`] = 'Required';
        }
      });
    }

    // projectsDescription validation removed

    // Ethics validation removed
    if (!ui.whyJoinCyberX || ui.whyJoinCyberX.length < 20)
      e.whyJoinCyberX = 'Minimum 20 characters';

    if (!ui.contributionAreas.length) e.contributionAreas = 'Select at least one role';

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



      return newState;
    });

    // Validations: Clear error when user types/selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const onSubmit = async (e) => {
    // ... (rest of function unchanged, just need to bridge the gap if I cut too much, but I will target carefully)
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
      if (key === 'domainLevels') {
        Object.entries(value).forEach(([domain, level]) => {
          if (ui.domainInterests.includes(domain)) {
            formData.append(`domainLevels[${domain}]`, level);
          }
        });
      } else if (Array.isArray(value)) {
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
      // Clear draft on successful submission
      localStorage.removeItem(STORAGE_KEY);
      setSuccess(true);
    } catch {
      setSubmitError('Submission failed. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fe = (n) => touched[n] && errors[n];

  // Helper function to get year options based on currentStatus
  const getYearOptions = () => {
    if (ui.statusDescription.includes('student')) {
      return ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Other (Please specify)'];
    } else if (ui.statusDescription.includes('professional')) {
      return ['< 1 Year', '1-2 Years', '2-5 Years', '5-10 Years', '> 10 Years', 'Other (Please specify)'];
    }
    return ['Other (Please specify)'];
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-12">
      <main className="w-full max-w-4xl">

        {/* Header / Logo */}
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
            <DecryptedText text="Cyber" />
            <span className="text-cyber-yellow"><DecryptedText text="X" /></span>
            <DecryptedText text=" Community" />
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
                <Field label="LinkedIn Profile URL" required error={fe('profileLinks')}>
                  <Input name="profileLinks" value={ui.profileLinks} onChange={onChange} placeholder="https://www.linkedin.com/in/..." />
                  <p className="mt-2 text-xs text-cyber-text-muted">
                    * Make sure you have an updated LinkedIn profile.
                  </p>
                </Field>
              </div>
            </Section>

            <Section title="Current Status & Education">
              {/* STATUS DESCRIPTION */}
              <div className="mb-6">
                <RadioRow
                  label="What describes me the best?"
                  name="statusDescription"
                  value={ui.statusDescription}
                  onChange={onChange}
                  error={fe('statusDescription')}
                  options={STATUS_OPTIONS}
                  vertical={true}
                />
              </div>

              {/* CONDITIONAL COLLEGE / ORGANIZATION NAME */}
              {ui.statusDescription && (
                <div className="mb-6 animate-fade-in">
                  <Field
                    label={ui.statusDescription === 'I am a working professional' ? 'Organization Name' : 'College Name'}
                    required
                    error={fe('organizationName')}
                  >
                    <Input
                      name="organizationName"
                      value={ui.organizationName}
                      onChange={onChange}
                      placeholder={ui.statusDescription === 'I am a working professional' ? 'Enter your organization name' : 'Enter your college name'}
                    />
                  </Field>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">



              </div>
            </Section>



            <Section title="Cybersecurity Domain Interests">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DOMAIN_INTERESTS.map(interest => {
                  const isSelected = ui.domainInterests.includes(interest);
                  return (
                    <div key={interest} className={`flex flex-col p-4 rounded-lg border transition-all duration-200 ${isSelected ? 'bg-cyber-card border-cyber-yellow/50' : 'bg-cyber-card border-cyber-border hover:border-cyber-border-hover'}`}>
                      <div className="flex items-start cursor-pointer" onClick={() => {
                        setUi(prev => {
                          const newInterests = toggleInArray(prev.domainInterests, interest);
                          const newLevels = { ...prev.domainLevels };
                          if (!newInterests.includes(interest)) delete newLevels[interest];
                          return { ...prev, domainInterests: newInterests, domainLevels: newLevels };
                        });
                      }}>
                        <div className="flex h-5 items-center pointer-events-none">
                          <input
                            id={`domain-${interest}`}
                            name="domainInterests"
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="h-4 w-4 rounded border-cyber-gray text-cyber-yellow focus:ring-cyber-yellow bg-cyber-black"
                          />
                        </div>
                        <div className="ml-3 text-sm pointer-events-none">
                          <label className={`font-medium ${isSelected ? 'text-white' : 'text-cyber-text-muted'} select-none`}>
                            {interest}
                          </label>
                        </div>
                      </div>

                      {/* Level Selection for Selected Domain */}
                      {isSelected && (
                        <div className="mt-3 ml-7 animate-fade-in border-t border-cyber-border pt-3">
                          <label className="block text-xs font-medium text-cyber-text-secondary mb-2">Proficiency Level</label>
                          <div className="flex flex-wrap gap-2">
                            {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setUi(prev => ({ ...prev, domainLevels: { ...prev.domainLevels, [interest]: lvl } }))
                                }}
                                className={`px-3 py-1 text-xs rounded-full border transition-all ${ui.domainLevels[interest] === lvl
                                  ? 'bg-cyber-yellow text-black border-cyber-yellow font-medium'
                                  : 'bg-transparent text-cyber-text-muted border-cyber-border hover:border-cyber-text-muted hover:text-white'
                                  }`}
                              >
                                {lvl}
                              </button>
                            ))}
                          </div>
                          {fe(`level_${interest}`) && <div className="mt-2 text-red-500 text-xs">{fe(`level_${interest}`)}</div>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {fe('domainInterests') && <div className="mt-3 text-red-500 text-xs font-medium px-1">{fe('domainInterests')}</div>}
            </Section>

            <Section title="Practical Exposure">
              <div className="flex flex-col gap-6">
                <div>
                  <label className="mb-3 text-sm font-medium text-cyber-text-secondary block">
                    From where do you learn hacking, or how do you learn based on your selected domain expertise? <span className="text-cyber-yellow">*</span>
                  </label>
                  <div className="flex flex-col gap-3">
                    {LEARNING_OPTIONS.map(opt => {
                      const isSelected = ui.platformsUsed.includes(opt);
                      return (
                        <div
                          key={opt}
                          onClick={() => {
                            setUi(prev => ({ ...prev, platformsUsed: toggleInArray(prev.platformsUsed, opt) }));
                            if (errors.platformsUsed) setErrors(prev => ({ ...prev, platformsUsed: undefined }));
                          }}
                          className={`flex items-center px-4 py-3 rounded-lg border cursor-pointer transition-all duration-200
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
                        </div>
                      );
                    })}
                  </div>
                  {fe('platformsUsed') && <div className="mt-1.5 text-red-500 text-xs font-medium">{fe('platformsUsed')}</div>}
                </div>

                {ui.platformsUsed.includes('I am learning through TryHackMe, Hack The Box and other like platforms') && (
                  <div className="animate-fade-in">
                    <Field label="Profile Link (TryHackMe / HackTheBox, etc.)" error={fe('platformProfileLink')}>
                      <Input name="platformProfileLink" value={ui.platformProfileLink} onChange={onChange} placeholder="e.g. https://tryhackme.com/p/username" />
                    </Field>
                  </div>
                )}

                {ui.platformsUsed.includes('I have done certification from EC-Council, INE, OffSec, THM and others') && (
                  <div className="animate-fade-in">
                    <Field label="Certification Name(s)" required error={fe('certificationDetails')}>
                      <Input name="certificationDetails" value={ui.certificationDetails} onChange={onChange} placeholder="e.g. CEH, OSCP, eJPT" />
                    </Field>
                  </div>
                )}
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
              </div>
            </Section>

            <Section title="Motivation to Join CyberX">
              {/* Ethics fields removed */}
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
              <div className="mb-6 space-y-6 text-sm text-cyber-text-secondary">
                <div>
                  <p className="mb-2"><span className="text-white font-medium">Primary Contribution:</span> Selection will be based on the individual’s core domain expertise in which they are shortlisted.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Open-source cybersecurity and hacking-related tools</li>
                    <li>Content creation in the form of PDFs, documentation, and structured learning material</li>
                    <li>Designing and developing hands-on labs and practical exercises</li>
                    <li>Conducting online sessions, workshops, or knowledge-sharing talks on relevant topics</li>
                    <li>Researching emerging cybersecurity trends and publishing technical insights</li>
                  </ul>
                </div>

                <div>
                  <p className="mb-2"><span className="text-white font-medium">Secondary Contribution:</span> This includes interest-based contributions outside the primary cybersecurity domain.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Social media handling and community engagement</li>
                    <li>Website management and content updates</li>
                    <li>Supporting tool development and maintenance</li>
                    <li>Partnership management and collaboration with companies and communities</li>
                    <li>Event organization, coordination, and related creative or design work</li>
                  </ul>
                </div>
              </div>
            </Section>

            <Section title="Declaration">
              <div className="mt-2">
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
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-cyber-yellow hover:bg-cyber-yellow-hover text-black font-semibold rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base cursor-pointer"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </div>

          </form>
        </div>

        {/* FAQ Section */}
        <div className="max-w-2xl mx-auto mb-20">
          <h3 className="text-2xl font-poppins font-semibold text-white text-center mb-8">
            Frequently Asked <span className="text-cyber-yellow">Questions</span>
          </h3>
          <div className="space-y-4">
            {FAQ_DATA.map((faq, index) => (
              <Disclosure key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
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

function RadioRow({ name, value, options, onChange, error, label, vertical = false }) {
  return (
    <div>
      {label && <label className="mb-3 text-sm font-medium text-cyber-text-secondary block">{label}</label>}
      <div className="flex flex-wrap gap-4">
        {options.map(opt => (
          <label
            key={opt}
            className={`cursor-pointer px-5 py-2 rounded-lg border transition-all duration-200 text-sm font-medium select-none
               ${vertical ? 'w-full text-left' : ''}
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

function Disclosure({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-cyber-border rounded-lg bg-cyber-card overflow-hidden transition-all duration-200 hover:border-cyber-border-hover">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="text-sm md:text-base font-medium text-white">{question}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-cyber-yellow transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`transition-all duration-200 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-4 pt-0 text-sm text-cyber-text-secondary leading-relaxed border-t border-cyber-border/50 mt-2">
          {answer}
        </div>
      </div>
    </div>
  );
}

function DecryptedText({ text, className = '' }) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'[Math.floor(Math.random() * 50)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{displayText}</span>;
}
