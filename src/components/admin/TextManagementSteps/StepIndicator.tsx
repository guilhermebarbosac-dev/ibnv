import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({
  currentStep,
  totalSteps,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        <nav className="flex items-center space-x-2" aria-label="Progress">
          {Array.from({ length: totalSteps }).map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <button
                key={index}
                onClick={() => onStepClick(stepNumber)}
                className={`relative flex items-center justify-center transition-colors ${
                  isCompleted || isCurrent
                    ? 'hover:bg-gray-100'
                    : 'cursor-not-allowed'
                }`}
              >
                <span className="absolute flex items-center justify-center w-8 h-8">
                  {isCompleted ? (
                    <Check className="w-4 h-4 text-gray-600" />
                  ) : (
                    <span
                      className={`text-sm font-medium ${
                        isCurrent ? 'text-gray-900' : 'text-gray-400'
                      }`}
                    >
                      {stepNumber}
                    </span>
                  )}
                </span>
                <span
                  className={`w-8 h-8 rounded-full border-2 ${
                    isCompleted
                      ? 'border-gray-600 bg-gray-50'
                      : isCurrent
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 bg-white'
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
