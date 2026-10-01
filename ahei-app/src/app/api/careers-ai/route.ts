import { NextRequest, NextResponse } from 'next/server';
import { AI_PROVIDERS } from '@/lib/ai-providers';

// ─── Step 4: Rate Limiting & Query Cache (In-Memory Protection) ───
interface RateLimitBucket {
  hourlyCount: number;
  hourlyReset: number;
  dailyCount: number;
  dailyReset: number;
}

const rateLimitMap = new Map<string, RateLimitBucket>();
const queryCache = new Map<string, { answer: string; provider: string; expiresAt: number }>();

const MAX_INPUT_CHARS = 1000;
const MAX_HOURLY_REQUESTS = 20;
const MAX_DAILY_REQUESTS = 60;
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour cache for repeated identical queries

function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return 'anonymous_visitor';
}

function checkRateLimit(clientId: string): { allowed: boolean; message?: string } {
  const now = Date.now();
  let bucket = rateLimitMap.get(clientId);

  if (!bucket) {
    bucket = {
      hourlyCount: 0,
      hourlyReset: now + 1000 * 60 * 60,
      dailyCount: 0,
      dailyReset: now + 1000 * 60 * 60 * 24,
    };
    rateLimitMap.set(clientId, bucket);
  }

  // Reset hourly window
  if (now > bucket.hourlyReset) {
    bucket.hourlyCount = 0;
    bucket.hourlyReset = now + 1000 * 60 * 60;
  }

  // Reset daily window
  if (now > bucket.dailyReset) {
    bucket.dailyCount = 0;
    bucket.dailyReset = now + 1000 * 60 * 60 * 24;
  }

  if (bucket.hourlyCount >= MAX_HOURLY_REQUESTS) {
    const minsLeft = Math.ceil((bucket.hourlyReset - now) / (1000 * 60));
    return {
      allowed: false,
      message: `Hourly advisory limit reached (${MAX_HOURLY_REQUESTS} requests/hr). Please try again in ${minsLeft} minutes.`,
    };
  }

  if (bucket.dailyCount >= MAX_DAILY_REQUESTS) {
    return {
      allowed: false,
      message: `Daily advisory limit reached (${MAX_DAILY_REQUESTS} requests/day). Quota resets tomorrow.`,
    };
  }

  bucket.hourlyCount += 1;
  bucket.dailyCount += 1;
  return { allowed: true };
}

// ─── Step 5: Grounded System Prompt ───
const AHEI_CAREERS_SYSTEM_PROMPT = `You are the AHEI African Careers & Degree Intelligence Guide for students and graduates exploring higher education across Africa.

CORE DIRECTIVES:
1. ONLY answer questions related to African careers, degree requirements, university course pathways, CV/resume guidance, and continental industry skills.
2. POLITELY REDIRECT any off-topic questions (e.g. general trivia, politics, coding problems unrelated to career prep, entertainment) with: "I am dedicated exclusively to African career planning, degree pathways, and university course guidance. Please ask me about academic tracks, job market skills, or CV tailoring."
3. NEVER invent or hallucinate job openings, employer vacancies, unverified salaries, application deadlines, or immigration/visa rules. If a specific figure or opening is not verified in official records, state: "I don't have verified registry records for that specific opening. Please consult the official university gazette or employer portal directly."
4. For academic degree programs, reference verified African faculties:
   - AI & Computing: Univ. of Cape Town, Univ. of Pretoria, Makerere, Univ. of Lagos, Cairo Univ.
   - Renewable Energy & Grid Architecture: Stellenbosch Univ., Univ. of Nairobi, Ain Shams Univ.
   - Clinical Health & Epidemiology: Univ. of the Witwatersrand, Univ. of Ibadan, Univ. of Ghana (Legon).
   - Commercial Law & AfCFTA Trade: Univ. of Pretoria, Univ. of Nairobi, Univ. of Cape Town.
   - Agritech & Food Systems: Kwame Nkrumah Univ. of Science and Technology (KNUST), Univ. of Ibadan, Egerton Univ.
5. KEEP ANSWERS SHORT, PLAIN, AND PRACTICAL. Avoid fluffy introductory pleasantries or corporate jargon. Maximum 3-4 bullet points or concise paragraphs.
6. REGULATORY MANDATE: If the user query touches on work visas, immigration, cross-border licensing, or statutory bar admissions, you MUST include this exact notice on a new line at the end:
"Check official sources before acting."`;

// ─── Step 4/6: Grounded Local Fallback Engine ───
function generateGroundedFallbackResponse(userMessage: string): string {
  const q = userMessage.toLowerCase();

  // Off-topic filter
  if (
    q.includes('weather') ||
    q.includes('recipe') ||
    q.includes('movie') ||
    q.includes('football match') ||
    q.includes('who won')
  ) {
    return "I am dedicated exclusively to African career planning, degree pathways, and university course guidance. Please ask me about academic tracks, job market skills, or CV tailoring.";
  }

  // Artificial Intelligence & Software
  if (q.includes('ai') || q.includes('software') || q.includes('computer') || q.includes('data')) {
    return `For careers in Artificial Intelligence and Computing in Africa:
• Recommended Degrees: BSc Computer Science, Data Science, or Software Engineering.
• Top Audited Faculties: University of Cape Town (South Africa), University of Pretoria, University of Lagos (Nigeria), and Cairo University (Egypt).
• Core Skills: Python, linear algebra, distributed data pipelines, and MLOps.
• Primary Hubs: Nairobi (Silicon Savannah), Lagos (Yaba), Cape Town, and Cairo.
• Career Outlook: High continental demand across fintech, agritech yield modeling, and localized language AI.`;
  }

  // Health & Medicine
  if (q.includes('health') || q.includes('doctor') || q.includes('medicine') || q.includes('epidemiolog')) {
    return `For careers in Clinical Medicine and Public Health in Africa:
• Recommended Degrees: MBChB / MBBS, Bachelor of Pharmacy, or BSc Public Health.
• Top Audited Faculties: University of the Witwatersrand (Wits), University of Ibadan (College of Medicine), University of Cape Town, and University of Ghana.
• Core Focus: Tropical infectious epidemiology, community health systems, and surgical residency.
• Important: Licensure requires post-degree housemanship and national medical council certification.
Check official sources before acting.`;
  }

  // Law, AfCFTA, Governance
  if (q.includes('law') || q.includes('lawyer') || q.includes('legal') || q.includes('afcfta')) {
    return `For careers in Commercial Law and Cross-Border Trade in Africa:
• Recommended Degrees: Bachelor of Laws (LLB) followed by national Law School / Bar admission.
• Top Audited Faculties: University of Pretoria (Centre for Human Rights & Trade), University of Nairobi (School of Law), and University of Cape Town.
• High-Demand Specializations: AfCFTA trade dispute arbitration, maritime logistics law, intellectual property, and sovereign finance.
• Important: Professional practice requires qualification before the sovereign bar in your target jurisdiction.
Check official sources before acting.`;
  }

  // CV / Resume Advice
  if (q.includes('cv') || q.includes('resume') || q.includes('cover letter')) {
    return `Key advice for an African graduate CV:
• Academic Credentials: List your audited degree title, institution, graduation date, and honors tier clearly at the top.
• Quantify Practical Projects: Highlight capstone dissertations, laboratory research, hackathons, or student union leadership.
• Relevant Technical Stack: Group tools (e.g. Python/SQL, AutoCAD, SPSS, Legal Research tools) by proficiency.
• Brevity: Keep entry-level CVs to a maximum of 2 clean pages with contact email and LinkedIn/GitHub links. Never include national ID or passport numbers.`;
  }

  // Generic Career Question
  return `Thank you for your inquiry regarding African higher education pathways.
• Review audited university faculties and 5-year employability scores in our rankings directory.
• Explore degree curricula and average starting tuition fees on each institution's dossier page.
• For tailored course roadmaps, select one of the 6 preset career tracks on this page or specify your field of interest (e.g. AI, Medicine, Engineering, Finance, or Law).`;
}

// ─── Step 2 & 3: Route Handler ───
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const userMessage = typeof body?.message === 'string' ? body.message.trim() : '';

    if (!userMessage) {
      return NextResponse.json(
        { error: 'Please enter a career or degree question.' },
        { status: 400 }
      );
    }

    // Step 4: Validate input length
    if (userMessage.length > MAX_INPUT_CHARS) {
      return NextResponse.json(
        { error: `Questions must be within ${MAX_INPUT_CHARS} characters. Currently ${userMessage.length} characters.` },
        { status: 400 }
      );
    }

    // Step 6: Sensitive data privacy check (warning against national ID / passport)
    const sensitivePatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN style
      /\b[A-Z]{1,2}\d{7,8}\b/i, // Typical Passport number
      /\bID:\s*\d{8,13}\b/i, // National ID
    ];
    if (sensitivePatterns.some((p) => p.test(userMessage))) {
      return NextResponse.json(
        {
          error:
            'For your privacy and security, do not enter passport numbers, national ID numbers, or sensitive financial data. Please rephrase your question.',
        },
        { status: 400 }
      );
    }

    // Step 4: Rate limit per visitor IP
    const clientId = getClientIdentifier(request);
    const limitCheck = checkRateLimit(clientId);
    if (!limitCheck.allowed) {
      return NextResponse.json(
        { error: limitCheck.message },
        { status: 429 }
      );
    }

    // Step 4: Query cache check
    const cacheKey = userMessage.toLowerCase();
    const cached = queryCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return NextResponse.json({
        answer: cached.answer,
        provider: `${cached.provider} (cached)`,
        cached: true,
      });
    }

    // Step 3: Provider Pool Failover Execution
    let finalAnswer: string | null = null;
    let successfulProviderName: string | null = null;

    for (const provider of AI_PROVIDERS) {
      const apiKey = process.env[provider.envKey];
      if (!apiKey && provider.envKey !== 'NONE') {
        // Skip provider if API key not configured
        continue;
      }

      try {
        const endpoint =
          typeof provider.endpoint === 'function'
            ? provider.endpoint(process.env)
            : provider.endpoint;

        const headers = provider.headers
          ? provider.headers(process.env)
          : { 'Content-Type': 'application/json' };

        const payload = provider.formatPayload(
          AHEI_CAREERS_SYSTEM_PROMPT,
          userMessage,
          provider.model
        );

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 9000); // 9-second timeout per provider

        const res = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (res.ok) {
          const data = await res.json();
          const parsed = provider.parseResponse(data);
          if (parsed) {
            finalAnswer = parsed;
            successfulProviderName = provider.name;
            break; // Stop at first successful provider
          }
        } else {
          // Log error type without user data
          console.warn(`[AI Pool] Provider ${provider.name} responded with status: ${res.status}`);
        }
      } catch (err: any) {
        // Log error code without logging user message
        console.warn(`[AI Pool] ${provider.name} failed (${err.name || 'Error'}). Failing over...`);
      }
    }

    // Step 4: Graceful Grounded Fallback if all providers fail or are unconfigured
    if (!finalAnswer) {
      finalAnswer = generateGroundedFallbackResponse(userMessage);
      successfulProviderName = 'AHEI Grounded Knowledge Engine';
    }

    // Post-process response to ensure required visa disclaimer if relevant
    const isVisaOrLegal = /visa|permit|immigration|statutory bar|licensure/i.test(userMessage);
    if (isVisaOrLegal && !finalAnswer.includes('Check official sources before acting.')) {
      finalAnswer = `${finalAnswer}\n\nCheck official sources before acting.`;
    }

    // Store in cache
    queryCache.set(cacheKey, {
      answer: finalAnswer,
      provider: successfulProviderName || 'AHEI Advisory',
      expiresAt: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json({
      answer: finalAnswer,
      provider: successfulProviderName,
    });
  } catch (error: any) {
    console.error('[AI Route] Internal handler error:', error?.message || error);
    return NextResponse.json({
      answer: generateGroundedFallbackResponse('general inquiry'),
      provider: 'AHEI Grounded Knowledge Engine',
    });
  }
}
