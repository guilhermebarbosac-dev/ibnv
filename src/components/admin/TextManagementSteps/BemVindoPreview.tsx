interface BemVindoPreviewProps {
  inputs: Record<string, string>;
}

export function BemVindoPreview({ inputs }: BemVindoPreviewProps) {
  const buttons = [
    {
      label: inputs['infoSectionsHome.context.bemVindo.buttons.label'] || 'Agenda',
      link: inputs['infoSectionsHome.context.bemVindo.buttons.link'] || '/agenda'
    },
    {
      label: inputs['infoSectionsHome.context.bemVindo.buttons.label2'] || 'Trilho de Crescimento',
      link: inputs['infoSectionsHome.context.bemVindo.buttons.link2'] || '/trilho-crescimento'
    },
    {
      label: inputs['infoSectionsHome.context.bemVindo.buttons.label3'] || 'Redes',
      link: inputs['infoSectionsHome.context.bemVindo.buttons.link3'] || '/redes'
    },
    {
      label: inputs['infoSectionsHome.context.bemVindo.buttons.label4'] || 'CET Nova Vida',
      link: inputs['infoSectionsHome.context.bemVindo.buttons.link4'] || '/downloads'
    }
  ];

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="font-medium text-gray-900">Preview</h3>
      </div>
      <div className="bg-black p-8 transform scale-90 origin-top">
        <div className="max-w-[800px] mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            {inputs['infoSectionsHome.context.bemVindo.title'] || 'Bem-vindo à Igreja Batista Nova Vida'}
          </h2>
          <p className="text-lg mb-8">
            {inputs['infoSectionsHome.context.bemVindo.description'] || 'Seja bem-vindo à Igreja Batista Nova Vida! Aqui, você encontrará um ambiente acolhedor e inspirador.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {buttons.map((button, index) => (
              <button
                key={index}
                className="inline-block bg-secondary text-white px-8 py-3 rounded-full font-medium
                         hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 