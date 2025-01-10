interface StepInput {
  key: string;
  label: string;
  value: string;
  type: 'text' | 'textarea' | 'url';
}

interface Step {
  id: string;
  title: string;
  description: string;
  inputs: StepInput[];
}

export const getEmptySteps = (): Step[] => [
  {
    id: 'bem-vindo',
    title: 'Seção Bem-vindo',
    description: 'Configure os textos e botões da seção de boas-vindas da página inicial.',
    inputs: [
      {
        key: 'sections.home.context.bemVindo.title',
        label: 'Título da Seção',
        value: '',
        type: 'text',
      },
      {
        key: 'sections.home.context.bemVindo.description',
        label: 'Descrição',
        value: '',
        type: 'textarea',
      },
      {
        key: 'sections.home.context.bemVindo.image',
        label: 'URL da Imagem',
        value: '',
        type: 'url',
      },
      {
        key: 'sections.home.context.bemVindo.buttons.label',
        label: 'Texto do Botão 1 (Agenda)',
        value: '',
        type: 'text',
      },
      {
        key: 'sections.home.context.bemVindo.buttons.link',
        label: 'Link do Botão 1',
        value: '',
        type: 'text',
      },
      {
        key: 'sections.home.context.bemVindo.buttons.label2',
        label: 'Texto do Botão 2 (Trilho de Crescimento)',
        value: '',
        type: 'text',
      },
      {
        key: 'sections.home.context.bemVindo.buttons.link2',
        label: 'Link do Botão 2',
        value: '',
        type: 'text',
      },
      {
        key: 'sections.home.context.bemVindo.buttons.label3',
        label: 'Texto do Botão 3 (Redes)',
        value: '',
        type: 'text',
      },
      {
        key: 'sections.home.context.bemVindo.buttons.link3',
        label: 'Link do Botão 3',
        value: '',
        type: 'text',
      },
      {
        key: 'sections.home.context.bemVindo.buttons.label4',
        label: 'Texto do Botão 4 (CET Nova Vida)',
        value: '',
        type: 'text',
      },
      {
        key: 'sections.home.context.bemVindo.buttons.link4',
        label: 'Link do Botão 4',
        value: '',
        type: 'text',
      }
    ]
  },
  {
    id: 'nossa-igreja',
    title: 'Seção Nossa Igreja',
    description: 'Configure os textos da seção que apresenta a igreja.',
    inputs: [
      {
        key: 'sections.our-church.title',
        label: 'Título da Seção',
        value: '',
        type: 'text',
      },
      {
        key: 'sections.our-church.description',
        label: 'Descrição',
        value: '',
        type: 'textarea',
      },
      {
        key: 'sections.our-church.image',
        label: 'URL da Imagem',
        value: '',
        type: 'url',
      },
      {
        key: 'sections.generosity.title',
        label: 'Título da Seção Generosidade',
        value: '',
        type: 'text',
      },
      {
        key: 'sections.generosity.description',
        label: 'Descrição da Seção Generosidade',
        value: '',
        type: 'textarea',
      },
      {
        key: 'sections.generosity.button',
        label: 'Texto do Botão',
        value: '',
        type: 'text',
      },
      {
        key: 'sections.generosity.image',
        label: 'URL da Imagem da Seção Generosidade',
        value: '',
        type: 'url',
      }
    ],
    
  },
  {
    id: 'transmissao',
    title: 'Seção de Transmissão',
    description: 'Configure os textos da seção de transmissão ao vivo e canal do YouTube.',
    inputs: [
      {
        key: 'transmission.live.title',
        label: 'Título da Transmissão Ao Vivo',
        value: '',
        type: 'text',
      },
      {
        key: 'transmission.live.description',
        label: 'Descrição da Transmissão Ao Vivo',
        value: '',
        type: 'textarea',
      },
      {
        key: 'transmission.youtube.title',
        label: 'Título do Canal do YouTube',
        value: '',
        type: 'text',
      },
      {
        key: 'transmission.youtube.description',
        label: 'Descrição do Canal do YouTube',
        value: '',
        type: 'textarea',
      }
    ]
  },
  {
    id: 'generosidade',
    title: 'Seção Generosidade',
    description: 'Configure os textos da seção de generosidade.',
    inputs: [
      {
        key: 'generosity.title',
        label: 'Título da Página',
        value: '',
        type: 'text',
      },
      {
        key: 'generosity.subtitle',
        label: 'Subtítulo',
        value: '',
        type: 'textarea',
      },
      {
        key: 'generosity.content.title',
        label: 'Título da Seção PIX',
        value: '',
        type: 'text',
      },
      {
        key: 'generosity.content.card.title',
        label: 'Título do Cartão PIX',
        value: '',
        type: 'text',
      },
      {
        key: 'generosity.content.pix.key',
        label: 'Chave PIX',
        value: '',
        type: 'text',
      },
      {
        key: 'generosity.content.pix.qrCode',
        label: 'QR Code PIX',
        value: '',
        type: 'text',
      },
      {
        key: 'generosity.content.qrCode.description',
        label: 'Descrição do QR Code',
        value: '',
        type: 'textarea',
      },
      // {
      //   key: 'generosity.content.verse',
      //   label: 'Versículo',
      //   value: '',
      //   type: 'textarea',
      // },
      // {
      //   key: 'generosity.content.reference',
      //   label: 'Referência do Versículo',
      //   value: '',
      //   type: 'text',
      // }
    ]
  },
  {
    id: 'trilho-crescimento',
    title: 'Trilho de Crescimento',
    description: 'Configure os textos da página do Trilho de Crescimento.',
    inputs: [
      {
        key: 'growth-track.title',
        label: 'Título da Página',
        value: '',
        type: 'text',
      },
      {
        key: 'growth-track.subtitle',
        label: 'Subtítulo',
        value: '',
        type: 'textarea',
      },
      {
        key: 'growth-track.steps.title1',
        label: 'Título do Passo 1',
        value: '',
        type: 'text',
      },
      {
        key: 'growth-track.steps.description1',
        label: 'Descrição do Passo 1',
        value: '',
        type: 'textarea',
      },
      {
        key: 'growth-track.steps.title2',
        label: 'Título do Passo 2',
        value: '',
        type: 'text',
      },
      {
        key: 'growth-track.steps.description2',
        label: 'Descrição do Passo 2',
        value: '',
        type: 'textarea',
      },
      {
        key: 'growth-track.steps.title3',
        label: 'Título do Passo 3',
        value: '',
        type: 'text',
      },
      {
        key: 'growth-track.steps.description3',
        label: 'Descrição do Passo 3',
        value: '',
        type: 'textarea',
      },
      {
        key: 'growth-track.cet.title',
        label: 'Título da Seção CET',
        value: '',
        type: 'text',
      },
      {
        key: 'growth-track.cet.basic.title',
        label: 'Título do CET Básico',
        value: '',
        type: 'text',
      },
      {
        key: 'growth-track.cet.basic.subtitle',
        label: 'Subtítulo do CET Básico',
        value: '',
        type: 'text',
      },
      {
        key: 'growth-track.cet.basic.description',
        label: 'Descrição do CET Básico',
        value: '',
        type: 'textarea',
      },
      {
        key: 'growth-track.cet.intermediate.title',
        label: 'Título do CET Intermediário',
        value: '',
        type: 'text',
      },
      {
        key: 'growth-track.cet.intermediate.subtitle',
        label: 'Subtítulo do CET Intermediário',
        value: '',
        type: 'text',
      },
      {
        key: 'growth-track.cet.intermediate.description',
        label: 'Descrição do CET Intermediário',
        value: '',
        type: 'textarea',
      },
      {
        key: 'growth-track.cet.advanced.title',
        label: 'Título do CET Avançado',
        value: '',
        type: 'text',
      },
      {
        key: 'growth-track.cet.advanced.subtitle',
        label: 'Subtítulo do CET Avançado',
        value: '',
        type: 'text',
      },
      {
        key: 'growth-track.cet.advanced.description',
        label: 'Descrição do CET Avançado',
        value: '',
        type: 'textarea',
      },
      // {
      //   key: 'growth-track.quote.text',
      //   label: 'Texto da Citação',
      //   value: '',
      //   type: 'textarea',
      // },
      // {
      //   key: 'growth-track.quote.reference',
      //   label: 'Referência da Citação',
      //   value: '',
      //   type: 'text',
      // }
    ]
  },
  {
    id: 'quem-somos',
    title: 'Quem Somos',
    description: 'Configure os textos da página Quem Somos.',
    inputs: [
      {
        key: 'who-we-are.title',
        label: 'Título da Página',
        value: '',
        type: 'text',
      },
      {
        key: 'who-we-are.subtitle',
        label: 'Subtítulo',
        value: '',
        type: 'text',
      },
      {
        key: 'who-we-are.history.title',
        label: 'Título da História',
        value: '',
        type: 'text',
      },
      {
        key: 'who-we-are.history.description',
        label: 'Descrição da História',
        value: '',
        type: 'textarea',
      },
      {
        key: 'who-we-are.mission.title',
        label: 'Título da Missão',
        value: '',
        type: 'text',
      },
      {
        key: 'who-we-are.mission.description',
        label: 'Descrição da Missão',
        value: '',
        type: 'textarea',
      },
      {
        key: 'who-we-are.values.title',
        label: 'Título dos Valores',
        value: '',
        type: 'text',
      },
      {
        key: 'who-we-are.values.option1',
        label: 'Valor 1',
        value: '',
        type: 'text',
      },
      {
        key: 'who-we-are.values.option2',
        label: 'Valor 2',
        value: '',
        type: 'text',
      },
      {
        key: 'who-we-are.values.option3',
        label: 'Valor 3',
        value: '',
        type: 'text',
      },
      {
        key: 'who-we-are.values.option4',
        label: 'Valor 4',
        value: '',
        type: 'text',
      },
      {
        key: 'who-we-are.values.option5',
        label: 'Valor 5',
        value: '',
        type: 'text',
      },
      {
        key: 'who-we-are.values.option6',
        label: 'Valor 6',
        value: '',
        type: 'text',
      },
      {
        key: 'who-we-are.vision.title',
        label: 'Título da Nossa Visão',
        value: '',
        type: 'text',
      },
      {
        key: 'who-we-are.vision.description',
        label: 'Descrição da Nossa Visão',
        value: '',
        type: 'textarea',
      }
    ]
  },
  {
    id: 'footer',
    title: 'Rodapé do Site',
    description: 'Configure as informações do rodapé do site.',
    inputs: [
      {
        key: 'footer.church.title',
        label: 'Título da Seção Igreja',
        value: '',
        type: 'text',
      },
      {
        key: 'footer.church.name',
        label: 'Nome da Igreja',
        value: '',
        type: 'text',
      },
      {
        key: 'footer.church.address',
        label: 'Endereço',
        value: '',
        type: 'text',
      },
      {
        key: 'footer.church.city',
        label: 'Cidade',
        value: '',
        type: 'text',
      },
      {
        key: 'footer.church.cep',
        label: 'CEP',
        value: '',
        type: 'text',
      },
      {
        key: 'footer.contact.title',
        label: 'Título da Seção Contato',
        value: '',
        type: 'text',
      },
      {
        key: 'footer.contact.phone',
        label: 'Telefone',
        value: '',
        type: 'text',
      },
      {
        key: 'footer.contact.whatsapp',
        label: 'WhatsApp',
        value: '',
        type: 'text',
      },
      {
        key: 'footer.contact.email',
        label: 'E-mail',
        value: '',
        type: 'text',
      },
      {
        key: 'footer.social-media.title',
        label: 'Título da Seção Redes Sociais',
        value: '',
        type: 'text',
      },
      {
        key: 'footer.social-media.instagram',
        label: 'Link do Instagram',
        value: '',
        type: 'url',
      },
      {
        key: 'footer.social-media.youtube',
        label: 'Link do YouTube',
        value: '',
        type: 'url',
      },
      {
        key: 'footer.copyright.text',
        label: 'Texto do Copyright',
        value: '',
        type: 'text',
      }
    ]
  }
];

export const populateStepsWithData = (data: Record<string, string>): Step[] => {
  const steps = getEmptySteps();
  return steps.map(step => ({
    ...step,
    inputs: step.inputs.map(input => ({
      ...input,
      value: data[input.key] || ''
    }))
  }));
};

export type { Step, StepInput };
