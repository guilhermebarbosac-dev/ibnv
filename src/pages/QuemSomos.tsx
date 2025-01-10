import { motion } from 'framer-motion';
import { Users, Target, Heart, Compass } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface AboutData {
  title: string;
  subtitle: string;
  historyTitle: string;
  historyDescription: string;
  missionTitle: string;
  missionDescription: string;
  valuesTitle: string;
  valuesOptions: string[];
  visionTitle: string;
  visionDescription: string;
}

export function QuemSomos() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AboutData>({
    title: '',
    subtitle: '',
    historyTitle: '',
    historyDescription: '',
    missionTitle: '',
    missionDescription: '',
    valuesTitle: '',
    valuesOptions: [],
    visionTitle: '',
    visionDescription: ''
  });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const { data: textData, error } = await supabase
        .from('text_data')
        .select('*')
        .in('key', [
          'who-we-are.title',
          'who-we-are.subtitle',
          'who-we-are.history.title',
          'who-we-are.history.description',
          'who-we-are.mission.title',
          'who-we-are.mission.description',
          'who-we-are.values.title',
          'who-we-are.values.option1',
          'who-we-are.values.option2',
          'who-we-are.values.option3',
          'who-we-are.values.option4',
          'who-we-are.values.option5',
          'who-we-are.values.option6',
          'who-we-are.vision.title',
          'who-we-are.vision.description'
        ]);

      if (error) throw error;

      if (textData) {
        const formattedData = textData.reduce((acc, item) => {
          const key = item.key.replace('who-we-are.', '');
          if (key.includes('.')) {
            const parts = key.split('.');
            if (parts[0] === 'values' && parts[1].startsWith('option')) {
              return {
                ...acc,
                valuesOptions: [...(acc.valuesOptions || []), item.value]
              };
            }
            const formattedKey = parts.reduce((k: string, part: string, i: number) => 
              i === 0 ? part : k + part.charAt(0).toUpperCase() + part.slice(1)
            );
            return { ...acc, [formattedKey]: item.value };
          }
          return { ...acc, [key]: item.value };
        }, {
          title: '',
          subtitle: '',
          historyTitle: '',
          historyDescription: '',
          missionTitle: '',
          missionDescription: '',
          valuesTitle: '',
          valuesOptions: [],
          visionTitle: '',
          visionDescription: ''
        } as AboutData);

        setData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  const sections = [
    {
      title: data.historyTitle,
      icon: Users,
      content: data.historyDescription
    },
    {
      title: data.missionTitle,
      icon: Target,
      content: data.missionDescription
    },
    {
      title: data.valuesTitle,
      icon: Heart,
      values: data.valuesOptions
    },
    {
      title: data.visionTitle,
      icon: Compass,
      content: data.visionDescription
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <motion.div
        className="mx-auto space-y-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div
          className="text-center space-y-4"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-7xl font-bold text-gray-900">
            {data.title}
          </h1>
          <p className="text-2xl text-gray-600">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Sections */}
        <div className="flex flex-col space-y-8 w-full mx-auto">
          {sections.map((section) => (
            <motion.div
              key={section.title}
              className="bg-white rounded-xl p-8 space-y-4"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-4">
                <section.icon className="w-8 h-8 text-secondary" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  {section.title}
                </h2>
              </div>
              {section.content ? (
                <p className="text-gray-600 leading-relaxed">
                  {section.content}
                </p>
              ) : (
                <ul className="space-y-2">
                  {section.values?.map((value, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-secondary rounded-full"></span>
                      <span className="text-gray-600">{value}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}