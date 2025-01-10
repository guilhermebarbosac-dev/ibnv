import { Step } from './stepsConfig';
import { BemVindoPreview } from './BemVindoPreview';

interface TextManagementStepsProps {
  currentStep: Step;
  onInputChange: (key: string, value: string) => void;
}

export function TextManagementSteps({ currentStep, onInputChange }: TextManagementStepsProps) {
  const inputValues = currentStep.inputs.reduce((acc, input) => {
    acc[input.key] = input.value;
    return acc;
  }, {} as Record<string, string>);

  const renderPreview = () => {
    if (currentStep.id === 'bem-vindo') {
      return (
        <div className="sticky top-6">
          <BemVindoPreview inputs={inputValues} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">{currentStep.title}</h2>
            <p className="text-sm text-gray-500 mb-6">{currentStep.description}</p>
            
            <div className="space-y-6">
              {currentStep.inputs.map((input) => (
                <div key={input.key}>
                  <label htmlFor={input.key} className="block text-sm font-medium text-gray-700 mb-1">
                    {input.label}
                  </label>
                  {input.type === 'textarea' ? (
                    <textarea
                      id={input.key}
                      value={input.value}
                      onChange={(e) => onInputChange(input.key, e.target.value)}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  ) : (
                    <input
                      type={input.type === 'url' ? 'url' : 'text'}
                      id={input.key}
                      value={input.value}
                      onChange={(e) => onInputChange(input.key, e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
} 