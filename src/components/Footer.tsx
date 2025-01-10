import { Link } from 'react-router-dom';
import { Instagram, Youtube, MapPin, Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface DropdownItem {
  label: string;
  path: string;
}

interface DropdownMenu {
  label: string;
  items: DropdownItem[];
}

interface FooterData {
  title: string;
  address: string;
  email: string;
  phone: string;
  instagram: string;
  youtube: string;
  copyright: string;
}

export function Footer() {
  const [data, setData] = useState<FooterData>({
    title: '',
    address: '',
    email: '',
    phone: '',
    instagram: '',
    youtube: '',
    copyright: ''
  });

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      const { data: textData, error } = await supabase
        .from('text_data')
        .select('*')
        .in('key', [
          'footer.church.title',
          'footer.church.address',
          'footer.church.city',
          'footer.contact.email',
          'footer.contact.phone',
          'footer.social-media.instagram',
          'footer.social-media.youtube',
          'footer.copyright.text'
        ]);

      if (error) throw error;

      if (textData) {
        const formattedData = textData.reduce((acc, item) => {
          const keyMap: Record<string, string> = {  
            'footer.church.title': 'title',
            'footer.church.address': 'address',
            'footer.church.city': 'city',
            'footer.contact.email': 'email',
            'footer.contact.phone': 'phone',
            'footer.social-media.instagram': 'instagram',
            'footer.social-media.youtube': 'youtube',
            'footer.copyright.text': 'copyright'
          };

          const mappedKey = keyMap[item.key];
          if (mappedKey) {
            return { ...acc, [mappedKey]: item.value };
          }
          return acc;
        }, {
          address: '',
          email: '',
          phone: '',
          instagram: '',
          youtube: '',
          copyright: ''
        } as FooterData);

        setData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
    }
  };

  const dropdownMenus: Record<string, DropdownMenu> = {
    'sobre-nos': {
      label: 'Sobre Nós',
      items: [
        { label: 'Quem Somos', path: '/quem-somos' },
        { label: 'Redes (ministérios)', path: '/redes' },
        { label: 'Trilho de Crescimento Espiritual', path: '/trilho-crescimento' },
        { label: 'Agenda', path: '/agenda' },
      ]
    },
    'participe': {
      label: 'Participe',
      items: [
        { label: 'Oferte e Contribua', path: '/generosidade' },
        { label: 'Pedido de oração', path: '/oracao' },
        { label: 'CET - Nova Vida', path: '/cet' },
        { label: 'IBNV Music', path: '/music' },
      ]
    },
    'celulas': {
      label: 'Células',
      items: [
        { label: 'Estudo de Células', path: '/estudos' },
        { label: 'Encontre uma célula', path: '/encontre-celula' },
      ]
    }
  };

  return (
    <footer className="bg-black text-white flex">
      <div className="w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-24 text-center justify-center">
          {/* Logo e Informações */}
          <div className="space-y-4">
              <h3 className="text-2xl font-semibold uppercase tracking-wider mb-4">
                {data.title}
              </h3>
            <div className="space-y-2 text-gray-400 text-xl">
              <div className="flex items-center justify-center space-x-2 whitespace-nowrap">
                <MapPin className="w-6 h-6" />
                <span>{data.address}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Mail className="w-6 h-6" />
                <a href={`mailto:${data.email}`} className="hover:text-white transition-colors">
                  {data.email}
                </a>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Phone className="w-6 h-6" />
                <a href={`tel:${data.phone}`} className="hover:text-white transition-colors">
                  {data.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(dropdownMenus).map(([key, menu]) => (
            <div key={key}>
              <h3 className="text-2xl font-semibold uppercase tracking-wider mb-4">
                {menu.label}
              </h3>
              <ul className="space-y-2">
                {menu.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-400 hover:text-white transition-colors text-xl"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Redes Sociais e Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <a
                href={data.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-8 h-8" />
              </a>
              <a
                href={data.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Youtube className="w-8 h-8" />
              </a>
            </div>
            <p className="text-gray-400 text-sm md:text-xl text-center">
              © 2025 {data.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}