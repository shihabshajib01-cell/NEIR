import React from 'react';
import { SearchX, Inbox, AlertTriangle, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '../forms/Button.jsx';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'Adjust your filters or try a different search term.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`p-8 text-center flex flex-col items-center justify-center max-w-sm mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-full bg-[#F7F8FC] border border-[#E2E5F0] flex items-center justify-center text-[#7A8197] mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-[#202338]">{title}</h4>
      <p className="text-xs text-[#7A8197] mt-1 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = 'Unable to load data',
  message = 'An operational error occurred while retrieving data from NEIR registry.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`p-6 text-center flex flex-col items-center justify-center border border-red-200 bg-red-50/50 rounded-lg max-w-md mx-auto my-4 ${className}`}>
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-2">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-red-900">{title}</h4>
      <p className="text-xs text-red-700 mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          icon={RefreshCw}
          className="mt-3.5 border-red-300 text-red-800 hover:bg-red-100"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export const LoadingState = ({
  message = 'Loading NEIR registry records...',
  className = '',
}) => {
  return (
    <div className={`p-10 flex flex-col items-center justify-center gap-2.5 ${className}`}>
      <Loader2 className="w-6 h-6 animate-spin text-[#4B5694]" />
      <span className="text-xs font-medium text-[#626981]">{message}</span>
    </div>
  );
};

export const Skeleton = ({ className = 'h-4 w-full', rounded = 'rounded' }) => {
  return (
    <div className={`animate-pulse bg-[#E2E8F0] ${rounded} ${className}`} />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="divide-y divide-[#E2E5F0]">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="p-3.5 flex items-center gap-4">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <Skeleton
              key={cIdx}
              className={`h-4 ${cIdx === 0 ? 'w-12' : cIdx === 1 ? 'w-36' : 'flex-1'}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
