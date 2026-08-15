import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave';
}

/**
 * Base Skeleton Component
 * Displays a loading placeholder with smooth animation
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
  variant = 'text',
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-neutral-200 dark:bg-neutral-700';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

/**
 * Card Skeleton - Simulates a project or entity card loading state
 */
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-neutral-200 p-4 space-y-3">
          {/* Header */}
          <div className="space-y-2">
            <Skeleton height={24} width="70%" />
            <Skeleton height={16} width="90%" />
          </div>
          
          {/* Content */}
          <div className="space-y-2">
            <Skeleton height={14} width="100%" />
            <Skeleton height={14} width="95%" />
            <Skeleton height={14} width="80%" />
          </div>
          
          {/* Footer - buttons/actions */}
          <div className="flex gap-2 pt-2">
            <Skeleton height={32} width={80} variant="rectangular" />
            <Skeleton height={32} width={80} variant="rectangular" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * List Skeleton - Simulates a table or list loading state
 */
export const ListSkeleton: React.FC<{ 
  rows?: number;
  columns?: number;
}> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 pb-4 border-b border-neutral-200">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={`header-${i}`} height={20} width="80%" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={`row-${rowIdx}`} className="grid grid-cols-4 gap-4 py-3 border-b border-neutral-100">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={`cell-${rowIdx}-${colIdx}`} height={16} width="85%" />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Detail Skeleton - Simulates a detail page loading state
 */
export const DetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <Skeleton height={32} width="60%" />
        <Skeleton height={20} width="40%" />
      </div>

      {/* Main content */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton height={16} width="20%" />
          <Skeleton height={14} width="100%" />
          <Skeleton height={14} width="100%" />
          <Skeleton height={14} width="80%" />
        </div>

        <div className="space-y-2">
          <Skeleton height={16} width="20%" />
          <Skeleton height={14} width="100%" />
          <Skeleton height={14} width="90%" />
        </div>

        <div className="space-y-2">
          <Skeleton height={16} width="20%" />
          <Skeleton height={14} width="100%" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Skeleton height={40} width={120} variant="rectangular" />
        <Skeleton height={40} width={120} variant="rectangular" />
      </div>
    </div>
  );
};

/**
 * Grid Skeleton - Simulates a grid of cards loading state
 */
export const GridSkeleton: React.FC<{
  count?: number;
  columns?: number;
}> = ({ count = 6, columns = 3 }) => {
  const colsMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };
  const colsClass = colsMap[columns] || 'grid-cols-3';

  return (
    <div className={`grid ${colsClass} gap-4`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-lg border border-neutral-200 p-4 space-y-3">
          <Skeleton height={120} variant="rectangular" />
          <Skeleton height={20} width="80%" />
          <Skeleton height={16} width="100%" />
          <Skeleton height={16} width="90%" />
          <div className="flex gap-2 pt-2">
            <Skeleton height={32} width="48%" variant="rectangular" />
            <Skeleton height={32} width="48%" variant="rectangular" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Input Skeleton - Simulates an input field loading state
 */
export const InputSkeleton: React.FC<{ label?: boolean }> = ({ label = true }) => {
  return (
    <div className="space-y-2">
      {label && <Skeleton height={16} width="30%" />}
      <Skeleton height={40} variant="rectangular" />
    </div>
  );
};

/**
 * User Avatar Skeleton - Simulates a user avatar loading state
 */
export const AvatarSkeleton: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return <Skeleton width={size} height={size} variant="circular" />;
};

/**
 * Section Skeleton - Reusable section with heading and content
 */
export const SectionSkeleton: React.FC<{
  title?: boolean;
  lines?: number;
}> = ({ title = true, lines = 3 }) => {
  return (
    <div className="space-y-3">
      {title && <Skeleton height={20} width="30%" />}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            height={14}
            width={i === lines - 1 ? '80%' : '100%'}
          />
        ))}
      </div>
    </div>
  );
};
