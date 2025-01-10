import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { Copy } from 'lucide-react';
import { useToastContext } from '../components/context/ToastContext';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface GenerosityData {
  title: string;
  subtitle: string;
  contentTitle: string;
  cardTitle: string;
  pixKey: string;
  pixQRCode: string;
  qrCodeDescription: string;
  verse: string;
  reference: string;
}

export function Generosidade() {
  const [data, setData] = useState<GenerosityData>({
    title: '',
    subtitle: '',
    contentTitle: '',
    cardTitle: '',
    pixKey: '',
    pixQRCode: '',
    qrCodeDescription: '',
    verse: '',
    reference: ''
  });
  const { addToast } = useToastContext();

  useEffect(() => {
    fetchGenerosityData();
  }, []);

  const fetchGenerosityData = async () => {
    try {
      const { data: textData, error } = await supabase
        .from('text_data')
        .select('*')
        .in('key', [
          'generosity.title',
          'generosity.subtitle',
          'generosity.content.title',
          'generosity.content.card.title',
          'generosity.content.pix.key',
          'generosity.content.pix.qrCode',
          'generosity.content.qrCode.description',
          'generosity.content.verse',
          'generosity.content.reference'
        ]);

      if (error) throw error;

      if (textData) {
        const formattedData = textData.reduce((acc, item) => {
          const keyMap: Record<string, string> = {
            'generosity.title': 'title',
            'generosity.subtitle': 'subtitle',
            'generosity.content.title': 'contentTitle',
            'generosity.content.card.title': 'cardTitle',
            'generosity.content.pix.key': 'pixKey',
            'generosity.content.pix.qrCode': 'pixQRCode',
            'generosity.content.qrCode.description': 'qrCodeDescription',
            'generosity.content.verse': 'verse',
            'generosity.content.reference': 'reference'
          };

          const mappedKey = keyMap[item.key];
          if (mappedKey) {
            return { ...acc, [mappedKey]: item.value };
          }
          return acc;
        }, {
          title: '',
          subtitle: '',
          contentTitle: '',
          cardTitle: '',
          pixKey: '',
          pixQRCode: '',
          qrCodeDescription: '',
          verse: '',
          reference: ''
        } as GenerosityData);

        setData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching generosity data:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <motion.div 
        className="container mx-auto max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-7xl lg:text-6xl font-bold mb-4">{data.title}</h1>
          <p className="text-gray-600 text-lg md:text-xl lg:text-2xl">
            {data.subtitle}
          </p>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl p-6 md:p-8"
          variants={itemVariants}
        >
          <div className="flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">{data.contentTitle}</h2>

            <div className="w-full max-w-md space-y-8">
              {/* Chave PIX */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <p className="text-lg text-gray-600 mb-3">{data.cardTitle}:</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-secondary select-all">{data.pixKey}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(data.pixKey);
                      addToast('CNPJ copiado para a área de transferência!', 'success');
                    }}
                    className="text-secondary hover:text-secondary-dark transition-colors"
                  >
                    <Copy className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white p-4">
                <div className="relative w-full max-w-[300px] mx-auto">
                  <QRCodeSVG
                    value={data.pixQRCode}
                    size={300}
                    level="H"
                    includeMargin={false}
                    bgColor="transparent"
                    fgColor="#333333"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
                      <img
                        src="/logo-black.png"
                        alt="Logo"
                        className="w-12 h-12 object-contain"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-lg text-center text-gray-600 mt-4 mb-4">
                  {data.qrCodeDescription}
                </p>
                <button 
                  className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-secondary-dark transition duration-300"
                  onClick={() => {
                    navigator.clipboard.writeText(data.pixQRCode);
                    addToast('Código copiado para a área de transferência!', 'success');
                  }}
                >
                  Copiar código PIX
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}