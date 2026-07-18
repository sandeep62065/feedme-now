import React from 'react';
import { CheckCircle2, Circle, Clock, ChefHat, Bike, Gift } from 'lucide-react';

const STATUS_STEPS = [
  { id: 'placed', label: 'Order Placed', icon: Clock },
  { id: 'preparing', label: 'Preparing', icon: ChefHat },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Bike },
  { id: 'delivered', label: 'Delivered', icon: Gift },
];

export default function OrderTracker({ currentStatus }) {
  const currentIdx = STATUS_STEPS.findIndex(s => s.id === currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800 text-center mb-6">
        <h3 className="text-red-700 dark:text-red-400 font-bold text-lg">Order Cancelled</h3>
        <p className="text-red-600 dark:text-red-500 text-sm mt-1">This order has been cancelled.</p>
      </div>
    );
  }

  return (
    <div className="mb-8 mt-2 px-2">
      <div className="relative">
        {/* Background Track */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-gray-200 dark:bg-gray-700 rounded-full" />
        
        {/* Active Track */}
        <div 
          className="absolute top-5 left-6 h-1 bg-amber-500 rounded-full transition-all duration-700 ease-in-out" 
          style={{ width: `calc(${currentIdx > 0 ? (currentIdx / (STATUS_STEPS.length - 1)) * 100 : 0}% - ${currentIdx === 0 ? 0 : 24}px)` }}
        />

        <div className="relative flex justify-between">
          {STATUS_STEPS.map((step, i) => {
            const isCompleted = i < currentIdx;
            const isCurrent = i === currentIdx;
            const Icon = step.icon;

            let bgColor = 'bg-gray-100 dark:bg-gray-800';
            let iconColor = 'text-gray-400';
            let ringColor = 'ring-gray-200 dark:ring-gray-700';

            if (isCompleted) {
              bgColor = 'bg-amber-500';
              iconColor = 'text-white';
              ringColor = 'ring-amber-200 dark:ring-amber-900/30';
            } else if (isCurrent) {
              bgColor = 'bg-white dark:bg-gray-900';
              iconColor = 'text-amber-500';
              ringColor = 'ring-amber-500 shadow-lg shadow-amber-500/20';
            }

            return (
              <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 w-16">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 transition-all duration-500 ${bgColor} ${ringColor} ${isCurrent ? 'scale-110' : ''}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className={`w-5 h-5 ${iconColor} ${isCurrent ? 'animate-pulse' : ''}`} />
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs font-bold text-center transition-colors duration-300 mt-1 ${isCurrent ? 'text-amber-600 dark:text-amber-400' : isCompleted ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
