import React from 'react';

export default function LoadingSkeleton({ type = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'restaurant':
      case 'card':
        return (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-3 border border-outline-variant/10 animate-pulse space-y-3">
            <div className="aspect-video bg-surface-container rounded-lg w-full"></div>
            <div className="h-4 bg-surface-container rounded w-3/4"></div>
            <div className="h-3 bg-surface-container rounded w-1/2"></div>
            <div className="flex justify-between items-center pt-2">
              <div className="h-4 bg-surface-container rounded w-1/4"></div>
              <div className="h-5 bg-surface-container rounded-full w-1/5"></div>
            </div>
          </div>
        );
      case 'menu':
        return (
          <div className="bg-white rounded-xl shadow-sm p-3 flex gap-4 border border-outline-variant/10 animate-pulse w-full">
            <div className="w-24 h-24 bg-surface-container rounded-lg shrink-0"></div>
            <div className="flex-1 flex flex-col justify-between py-1 space-y-2">
              <div>
                <div className="h-4 bg-surface-container rounded w-1/3"></div>
                <div className="h-3 bg-surface-container rounded w-2/3 mt-2"></div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 bg-surface-container rounded w-1/6"></div>
                <div className="h-8 bg-surface-container rounded-full w-1/4"></div>
              </div>
            </div>
          </div>
        );
      case 'banner':
        return (
          <div className="w-full aspect-[21/9] bg-surface-container rounded-xl animate-pulse"></div>
        );
      case 'list':
      default:
        return (
          <div className="flex items-center space-x-4 animate-pulse w-full p-2">
            <div className="rounded-full bg-surface-container h-12 w-12"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-surface-container rounded w-1/3"></div>
              <div className="h-3 bg-surface-container rounded w-3/4"></div>
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
}
