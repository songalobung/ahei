import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'AHEI — African Higher Education Index';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090B',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                background: '#164A3A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#ffffff',
              }}
            >
              A
            </div>
            <span
              style={{
                fontSize: '28px',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: '#ffffff',
              }}
            >
              AHEI
            </span>
          </div>
          <div
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              background: '#18181B',
              border: '1px solid #27272A',
              fontSize: '14px',
              fontWeight: 600,
              color: '#A1A1AA',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Sovereign Academic Registry
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: '52px',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#ffffff',
              letterSpacing: '-0.03em',
            }}
          >
            African Higher Education Index
          </div>
          <div
            style={{
              fontSize: '22px',
              lineHeight: 1.4,
              color: '#A1A1AA',
              maxWidth: '900px',
            }}
          >
            The authoritative continental academic registry and university rankings evaluating higher education across 54 African nations.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #27272A',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', color: '#71717A', textTransform: 'uppercase' }}>Scope</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>54 Member States</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', color: '#71717A', textTransform: 'uppercase' }}>Audited Institutions</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#164A3A' }}>1,000+ Verified</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '13px', color: '#71717A', textTransform: 'uppercase' }}>Edition</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff' }}>2027 Continental Release</span>
            </div>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#71717A' }}>
            ahei.africa
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
