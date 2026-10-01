'use client';

import React from 'react';
import Link from 'next/link';
import { useUniversities } from './InstitutionsProvider';
import { useCompare } from './CompareProvider';

export function CompareBar() {
  const { compareIds, removeFromCompare } = useCompare();
  const { universities } = useUniversities();

  const compareUniversities = compareIds
    .map((id) => universities.find((u) => u.id === id))
    .filter(Boolean);

  return (
    <div
      className="compare-bar"
      data-visible={compareIds.length > 0 ? 'true' : 'false'}
    >
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-title-md" style={{ color: '#232323', whiteSpace: 'nowrap' }}>
          Compare
          <span
            className="font-code-badge ml-1"
            style={{
              background: '#09090B',
              color: '#FFFFFF',
              borderRadius: '2px',
              padding: '1px 5px',
              fontSize: '10px',
            }}
          >
            {compareIds.length}/4
          </span>
        </span>

        <div className="flex items-center gap-2 flex-wrap">
          {compareUniversities.map((u) =>
            u ? (
              <div key={u.id} className="compare-chip">
                <span>{u.name}</span>
                <button
                  onClick={() => removeFromCompare(u.id)}
                  aria-label={`Remove ${u.name} from comparison`}
                >
                  ×
                </button>
              </div>
            ) : null
          )}
        </div>
      </div>

      <Link href={`/compare?ids=${compareIds.join(',')}`} className="btn-primary no-underline">
        Compare Now →
      </Link>
    </div>
  );
}
