import { useTexts } from '../hooks/useTexts';

export function useWebsiteTexts() {
  const { texts, loading } = useTexts();

  const websiteTexts = {
    titleSlidesHome: {
      slidesInfoHome: {
        title: texts['slides.home.title'] || "Igreja Batista Nova Vida",
        description: texts['slides.home.description'] || "Uma família para voce pertencer",
        labelButton: texts['slides.home.button'] || "Conheça Nossa Igreja",
      },
      transmission: {
        aoVivo: texts['transmission.live'] || "Ao Vivo",
        canalYoutube: texts['transmission.youtube'] || "Canal do Youtube"
      }
    },
    eventsHome: {
      title: texts['events.title'] || "Proximos Eventos",
    },
    infoSectionsHome: {
      context: {
        bemVindo: {
          title: texts['sections.home.context.bemVindo.title'] || "Bem-vindo à Igreja Batista Nova Vida",
          description: texts['sections.home.context.bemVindo.description'] || "Seja bem-vindo à Igreja Batista Nova Vida! Aqui, você encontrará um ambiente acolhedor e inspirador, onde você pode explorar a fé e se conectar com outros membros da comunidade cristã. Nossa igreja é um lugar onde você pode encontrar apoio, amor e crescimento espiritual. Venha conhecer nossa história e como podemos ajudar você a encontrar a paz e a alegria que Jesus oferece. Junte-se a nós e comece a explorar o que a Igreja Batista Nova Vida pode oferecer para você e sua família.",
          image: texts['sections.home.context.bemVindo.image'] || "/images/bem-vindo.jpg",
          buttons: [
            {
              label: texts['sections.home.context.bemVindo.buttons.label'] || "Agenda",
              link: texts['sections.home.context.bemVindo.buttons.link'] || "/agenda"
            },
            {
              label: texts['sections.home.context.bemVindo.buttons.label2'] || "Trilho de Crescimento",
              link: texts['sections.home.context.bemVindo.buttons.link2'] || "/trilho-de-crescimento"
            },
            {
              label: texts['sections.home.context.bemVindo.buttons.label3'] || "Redes",
              link: texts['sections.home.context.bemVindo.buttons.link3'] || "/redes"
            },
            {
              label: texts['sections.home.context.bemVindo.buttons.label4'] || "CET Nova Vida",
              link: texts['sections.home.context.bemVindo.buttons.link4'] || "/downloads"
            }
          ]
        },
        nossaIgreja: {
          title: texts['sections.our-church.title'] || "Nossa Igreja",
          description: texts['sections.our-church.description'] || "Na Igreja Batista Nova Vida, acreditamos no poder transformador do amor de Deus. Venha fazer parte desta família e crescer espiritualmente conosco.",
          image: texts['sections.our-church.image'] || "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
        },
        generosidade: {
          title: texts['sections.generosity.title'] || "Generosidade",
          description: texts['sections.generosity.description'] || "Sua generosidade através de dízimos e ofertas é fundamental para a expansão do Reino de Deus. Cada contribuição nos permite alcançar mais vidas e fortalecer nossa missão.",
          image: texts['sections.generosity.image'] || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          labelButton: texts['sections.generosity.button'] || "Contribua"
        }
      },
      transmission: {
        aoVivo: {
          title: texts['transmission.live.title'] || "Ao Vivo",
          description: texts['transmission.live.description'] || "Assista nossas transmissões ao vivo para acompanhar nossas atividades e eventos. Venha se conectar com a igreja e o Reino de Deus."
        },
        canalYoutube: {
          title: texts['transmission.youtube.title'] || "Canal do Youtube",
          description: texts['transmission.youtube.description'] || "Participe da nossa comunidade online, onde compartilhamos a Palavra de Deus e celebramos juntos, mesmo à distância."
        }
      }
    },
    generosity: {
      header: {
        title: texts['generosity.title'] || "Generosidade",
        subtitle: texts['generosity.subtitle'] || "Sua contribuição é fundamental para mantermos e expandirmos o trabalho do Reino de Deus através da nossa igreja.",  
      },
      content: {
        title: texts['generosity.content.title'] || "Dados para PIX",
        titleCard: texts['generosity.content.card.title'] || "Chave PIX (CNPJ):",
        pixKey: texts['generosity.content.pix.key'] || "40.182.874/0001-21",
        pixQRCode: texts['generosity.content.pix.qrCode'] || "00020101021126580014br.gov.bcb.pix01360c6e84ed-0cdc-40f2-a7ff-48a75037fd2c5204000053039865802BR5925Igreja B N V Em C Alagoas6009SAO PAULO62070503***630414E5",
        descriptionQrCode: texts['generosity.content.qrCode.description'] || "Escaneie o QR Code ou copie e cole a chave PIX para realizar sua doação.",
        labelButton: texts['generosity.content.button'] || "Copiar código PIX",
        titlePix: texts['generosity.content.pix.name'] || "Nome:",
        pixName: texts['generosity.content.pix.name.value'] || "Igreja Batista Nova Vida",
        titlePix2: texts['generosity.content.pix.city'] || "Cidade:",
        pixCity: texts['generosity.content.pix.city.value'] || "Conceição das Alagoas - MG",
        verse: texts['generosity.content.verse'] || "Cada um contribua segundo propôs no seu coração; não com tristeza, ou por necessidade; porque Deus ama ao que dá com alegria.",
        reference: texts['generosity.content.reference'] || "2 Corintios 9:7",
      }
    },
    growthTrack: {
      header: {
        title: texts['growth-track.title'] || "Trilho de Crescimento",
        subtitle: texts['growth-track.subtitle'] || "Maturidade é Servir - Um caminho de crescimento espiritual e desenvolvimento ministerial"
      },
      steps: [
        {
          title: texts['growth-track.steps.title1'] || "Cartão Conexão",
          description: texts['growth-track.steps.description1'] || "Primeiro passo para visitantes conhecerem nossa igreja. Preencha o formulário e receba informações sobre nossas atividades e eventos.",
          icon: texts['growth-track.steps.icon1'] || "Users"
        },
        {
          title: texts['growth-track.steps.title2'] || "Café Conexão",
          description: texts['growth-track.steps.description2'] || "Um momento especial para conhecer mais sobre nossa igreja, seus propósitos, valores, história e funcionamento. Uma oportunidade de conexão e comunhão.",
          icon: texts['growth-track.steps.icon2'] || "Coffee"
        },
        {
          title: texts['growth-track.steps.title3'] || "Integração",
          description: texts['growth-track.steps.description3'] || "Para aqueles que desejam fazer parte da IBNV, oferecemos uma apresentação completa dos propósitos, valores e história da igreja, além de encaminhamento para células.",
          icon: texts['growth-track.steps.icon3'] || "Users"
        }
      ],
      courses: [
        {
          title: texts['growth-track.courses.title1'] || "CET Básico",
          subtitle: texts['growth-track.courses.subtitle1'] || "Escola Maturidade Espiritual",
          description: texts['growth-track.courses.description1'] || "Fundamentos da fé e crescimento espiritual"
        },
        {
          title: texts['growth-track.courses.title2'] || "CET Intermediário",
          subtitle: texts['growth-track.courses.subtitle2'] || "TLC (Treinamento de Líderes de Células)",
          description: texts['growth-track.courses.description2'] || "Formação de líderes e ministério celular"
        },
        {
          title: texts['growth-track.courses.title3'] || "CET Avançado",
          subtitle: texts['growth-track.courses.subtitle3'] || "Teologia Bíblica",
          description: texts['growth-track.courses.description3'] || "Aprofundamento teológico e ministerial"
        }
      ],
      cetSection: {
        title: texts['growth-track.cet.title'] || "CET - Centro de Estudos Nova Vida"
      },
      quote: {
        text: texts['growth-track.quote.text'] || "Vocês, porém, são geração eleita, sacerdócio real, nação santa, povo de propriedade exclusiva de Deus, a fim de proclamar as virtudes daquele que os chamou das trevas para a sua maravilhosa luz.",
        reference: texts['growth-track.quote.reference'] || "1 Pedro 2:9"
      }
    },
    whoWeAre: {
      header: {
        title: texts['who-we-are.title'] || "Quem Somos",
        subtitle: texts['who-we-are.subtitle'] || "Uma igreja para voce pertencer"
      },
      content: {
        history: {
          title: texts['who-we-are.history.title'] || "Nossa História",
          description: texts['who-we-are.history.description'] || "A Igreja Batista Nova Vida tem uma rica história de serviço a Deus e à comunidade. Fundada com o propósito de ser um farol de esperança em Conceição das Alagoas, nossa igreja tem crescido através do compromisso com a Palavra de Deus e o amor ao próximo.",
        },
        mission: {
          title: texts['who-we-are.mission.title'] || "Nossa Missão",
          description: texts['who-we-are.mission.description'] || "Nossa missão é fazer discípulos de Jesus Cristo, transformando vidas através do poder do Evangelho, proporcionando um ambiente de crescimento espiritual, comunhão e serviço ao próximo."
        },
        values: {
          title: texts['who-we-are.values.title'] || "Nossos Valores",
          list: [
            {
              option1: texts['who-we-are.values.option1'] || "Compromisso com a Palavra de Deus",
              option2: texts['who-we-are.values.option2'] || "Amor e acolhimento ao próximo",
              option3: texts['who-we-are.values.option3'] || "Família como base da sociedade",
              option4: texts['who-we-are.values.option4'] || "Excelência no serviço ao Senhor",
              option5: texts['who-we-are.values.option5'] || "Discipulado e crescimento espiritual",
              option6: texts['who-we-are.values.option6'] || "Evangelismo e missões"
            }
          ]
        },
        vision: {
          title: texts['who-we-are.vision.title'] || "Nossa Visão",
          description: texts['who-we-are.vision.description'] || "Ser uma igreja que impacta vidas através do amor de Cristo, formando discípulos comprometidos com Deus e com a transformação da sociedade, alcançando famílias e gerações com a mensagem do Evangelho."
        }
      }
    },
    footer: {
      church: {
        title: texts['footer.church.title'] || "Nossa Igreja",
        name: texts['footer.church.name'] || "Igreja Batista Nova Vida",
        address: texts['footer.church.address'] || "Praça Amaro José do Carmo, 100",
        city: texts['footer.church.city'] || "Santa Isabel, Conceição das Alagoas - MG",
        cep: texts['footer.church.cep'] || "38120-000"
      },
      contact: {
        title: texts['footer.contact.title'] || "Entre em Contato",
        phone: texts['footer.contact.phone'] || "(34) 3327-0522",
        whatsapp: texts['footer.contact.whatsapp'] || "(34) 3327-0522",
        email: texts['footer.contact.email'] || "ibnvconceicao@gmail.com",
      },
      links: {
        title: texts['footer.links.title'] || "Links",
        links: {
          home: texts['footer.links.home'] || "Início",
          events: texts['footer.links.events'] || "Programação",
          whoWeAre: texts['footer.links.who-we-are'] || "Quem Somos",
          growthTrack: texts['footer.links.growth-track'] || "Trilho de Crescimento",
          files: texts['footer.links.files'] || "Arquivos",
          generosity: texts['footer.links.generosity'] || "Generosidade",
          networks: texts['footer.links.networks'] || "Redes"
        }
      },
      socialMedia: {
        title: texts['footer.social-media.title'] || "Redes Sociais",
        instagram: texts['footer.social-media.instagram'] || "https://www.instagram.com/ibnvida?igsh=cXB4dGkxMjljdW1z",
        youtube: texts['footer.social-media.youtube'] || "https://youtube.com/@igrejabatistanovavidaibnv2500?si=HijGMHaJLPXec0Iv",
      },
      copyright: {
        text: texts['footer.copyright.text'] || "2024 Igreja Batista Nova Vida. Todos os direitos reservados."
      }
    }
  };

  return { websiteTexts, loading };
}
