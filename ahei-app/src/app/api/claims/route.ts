import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ClaimantInfo {
  fullName: string;
  email: string;
  designation: string;
  phone?: string;
}

interface ClaimEvidence {
  sourceDocumentUrl: string;
  gazetteReference?: string;
  verificationNotes: string;
}

interface InstitutionalProfileCorrection {
  name?: string;
  nativeMotto?: string;
  viceChancellor?: string;
  primaryAccreditation?: string;
  city?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  type?: string;
  estYear?: number;
  charterYear?: number;
  website?: string;
  campusesCount?: number;
  campusesList?: string[];
  domesticTuitionAverage?: string;
  domesticTuitionUsd?: string;
  internationalTuitionAnnual?: string;
  averageMonthlyLiving?: string;
  onCampusAccommodation?: string;
  financialAidTier?: string;
  totalEnrollment?: number;
  academicStaff?: number;
  phdFacultyShare?: number;
  studentFacultyRatio?: string;
  internationalDiversityPct?: number;
  degreesOfferedCount?: number;
  undergradDegreesCount?: number;
  postgradDegreesCount?: number;
  doctoralProgramsCount?: number;
  flagshipFaculties?: string;
  description?: string;
  [key: string]: any;
}

interface ClaimSubmission {
  id?: string;
  createdAt?: string;
  institutionId: string;
  institutionName: string;
  country: string;
  claimType: 'FULL_PROFILE_VERIFICATION' | 'TARGETED_FIELD_CORRECTION' | 'GOVERNANCE_UPDATE' | 'TUITION_CALIBRATION';
  claimant: ClaimantInfo;
  evidence: ClaimEvidence;
  profileData: InstitutionalProfileCorrection;
  status?: 'PENDING_REVIEW' | 'UNDER_SOVEREIGN_VERIFICATION' | 'APPROVED' | 'REJECTED';
  reviewedAt?: string | null;
  reviewer?: string | null;
}

const CLAIMS_FILE = path.join(process.cwd(), 'src', 'data', 'claims.json');

function readClaims(): ClaimSubmission[] {
  try {
    if (fs.existsSync(CLAIMS_FILE)) {
      const data = fs.readFileSync(CLAIMS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading claims:', err);
  }
  return [];
}

function writeClaims(claims: ClaimSubmission[]) {
  try {
    fs.writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing claims:', err);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const institutionId = searchParams.get('institutionId');
    const status = searchParams.get('status');

    let claims = readClaims();

    if (institutionId) {
      claims = claims.filter((c) => c.institutionId === institutionId);
    }

    if (status) {
      claims = claims.filter((c) => c.status === status);
    }

    return NextResponse.json({
      success: true,
      total: claims.length,
      claims,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch claims' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: ClaimSubmission = await req.json();

    if (!body.institutionId || !body.institutionName) {
      return NextResponse.json(
        { success: false, error: 'Institution ID and Name are required.' },
        { status: 400 }
      );
    }

    if (!body.claimant?.fullName || !body.claimant?.email) {
      return NextResponse.json(
        { success: false, error: 'Claimant Full Name and Institutional Email are required.' },
        { status: 400 }
      );
    }

    if (!body.evidence?.sourceDocumentUrl) {
      return NextResponse.json(
        { success: false, error: 'Official Evidence Document URL or Gazette Link is required.' },
        { status: 400 }
      );
    }

    const claims = readClaims();
    const claimSeq = String(claims.length + 1).padStart(4, '0');
    const claimId = `AHEI-CLAIM-2026-${claimSeq}`;

    const newClaim: ClaimSubmission = {
      id: claimId,
      createdAt: new Date().toISOString(),
      institutionId: body.institutionId,
      institutionName: body.institutionName,
      country: body.country || 'Africa',
      claimType: body.claimType || 'FULL_PROFILE_VERIFICATION',
      claimant: {
        fullName: body.claimant.fullName.trim(),
        email: body.claimant.email.trim().toLowerCase(),
        designation: body.claimant.designation?.trim() || 'Institutional Representative',
        phone: body.claimant.phone?.trim() || '',
      },
      evidence: {
        sourceDocumentUrl: body.evidence.sourceDocumentUrl.trim(),
        gazetteReference: body.evidence.gazetteReference?.trim() || 'Sovereign Regulatory Registry',
        verificationNotes: body.evidence.verificationNotes?.trim() || 'Submitted for factual accuracy audit.',
      },
      profileData: body.profileData || {},
      status: 'PENDING_REVIEW',
      reviewedAt: null,
      reviewer: null,
    };

    claims.unshift(newClaim);
    writeClaims(claims);

    return NextResponse.json({
      success: true,
      claimId,
      message: 'Institutional correction claim submitted successfully. Staged for Sovereign Audit Verification.',
      claim: newClaim,
    });
  } catch (error: any) {
    console.error('Error submitting correction claim:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error processing claim' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const claimId = searchParams.get('id');
    const body = await req.json();

    if (!claimId) {
      return NextResponse.json({ success: false, error: 'Claim ID required' }, { status: 400 });
    }

    const claims = readClaims();
    const index = claims.findIndex((c) => c.id === claimId);

    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Claim not found' }, { status: 404 });
    }

    claims[index] = {
      ...claims[index],
      ...body,
      reviewedAt: new Date().toISOString(),
    };

    writeClaims(claims);

    return NextResponse.json({
      success: true,
      claim: claims[index],
      message: `Claim ${claimId} status updated to ${claims[index].status}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Server error updating claim' },
      { status: 500 }
    );
  }
}
