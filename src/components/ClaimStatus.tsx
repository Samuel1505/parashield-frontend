'use client';

import { useClaim } from '@/hooks/useClaim';
import { useWallet } from '@/hooks/useWallet';
import { Badge } from './Badge';
import { LoadingSpinner } from './LoadingSpinner';
import { formatDateTime, formatUSDC } from '@/lib/format';

interface ClaimStatusProps {
  policyId: string;
}

export function ClaimStatus({ policyId }: ClaimStatusProps) {
  const { address }                           = useWallet();
  const { step, claim, error, submit, reset } = useClaim();

  async function handleSubmit() {
    if (!address) return;
    await submit(address, policyId);
  }

  if (step === 'idle') {
    return (
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">No claim submitted for this policy.</p>
        {address && (
          <button
            onClick={handleSubmit}
            className="rounded-xl border border-white/10 px-4 py-1.5 text-xs font-semibold text-gray-300 hover:border-teal-500/30 hover:text-teal-400 transition-colors"
          >
            Submit Claim
          </button>
        )}
      </div>
    );
  }

  if (step === 'submitting' || step === 'polling') {
    return (
      <div className="flex items-center gap-3 text-sm text-gray-400">
        <LoadingSpinner size="sm" />
        <span>{step === 'submitting' ? 'Submitting claim…' : 'Processing claim…'}</span>
      </div>
    );
  }

  if (step === 'error') {
    return (
      <div className="flex items-center justify-between">
        <p className="text-sm text-red-400">{error}</p>
        <button onClick={reset} className="text-xs text-gray-400 hover:text-white transition-colors">
          Try again
        </button>
      </div>
    );
  }

  if (step === 'done' && claim) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Badge label={claim.status} />
          {claim.payoutAmount && (
            <span className="text-sm font-semibold text-emerald-400">
              {formatUSDC(claim.payoutAmount)} paid out
            </span>
          )}
        </div>
        {claim.processedAt && (
          <p className="text-xs text-gray-500">Processed {formatDateTime(claim.processedAt)}</p>
        )}
        <p className="text-xs text-gray-500">
          Trigger:{' '}
          <span className={claim.triggerMet ? 'text-emerald-400' : 'text-red-400'}>
            {claim.triggerMet ? 'Met' : 'Not met'}
          </span>
        </p>
      </div>
    );
  }

  return null;
}
