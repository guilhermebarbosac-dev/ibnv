import { motion } from 'framer-motion';
import { Target, Users, BookOpen, Coffee, ArrowDownToLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader } from '../components/ui/Loader';

interface GrowthTrackData {
  title: string;
  subtitle: string;
  step1Title: string;
  step1Description: string;
  step2Title: string;
  step2Description: string;
  step3Title: string;
  step3Description: string;
  cetTitle: string;
  cetBasicTitle: string;
  cetBasicSubtitle: string;
  cetBasicDescription: string;
  cetIntermediateTitle: string;
  cetIntermediateSubtitle: string;
  cetIntermediateDescription: string;
  cetAdvancedTitle: string;
  cetAdvancedSubtitle: string;
  cetAdvancedDescription: string;
  quoteText: string;
  quoteReference: string;
}

export function TrilhoCrescimento() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<GrowthTrackData>({
    title: '',
    subtitle: '',
    step1Title: '',
    step1Description: '',
    step2Title: '',
    step2Description: '',
    step3Title: '',
    step3Description: '',
    cetTitle: '',
    cetBasicTitle: '',
    cetBasicSubtitle: '',
    cetBasicDescription: '',
    cetIntermediateTitle: '',
    cetIntermediateSubtitle: '',
    cetIntermediateDescription: '',
    cetAdvancedTitle: '',
    cetAdvancedSubtitle: '',
    cetAdvancedDescription: '',
    quoteText: '',
    quoteReference: ''
  });

  useEffect(() => {
    fetchGrowthTrackData();
  }, []);

  const fetchGrowthTrackData = async () => {
    try {
      const { data: textData, error } = await supabase
        .from('text_data')
        .select('*')
        .in('key', [
          'growth-track.title',
          'growth-track.subtitle',
          'growth-track.steps.title1',
          'growth-track.steps.description1',
          'growth-track.steps.title2',
          'growth-track.steps.description2',
          'growth-track.steps.title3',
          'growth-track.steps.description3',
          'growth-track.cet.title',
          'growth-track.cet.basic.title',
          'growth-track.cet.basic.subtitle',
          'growth-track.cet.basic.description',
          'growth-track.cet.intermediate.title',
          'growth-track.cet.intermediate.subtitle',
          'growth-track.cet.intermediate.description',
          'growth-track.cet.advanced.title',
          'growth-track.cet.advanced.subtitle',
          'growth-track.cet.advanced.description',
          'growth-track.quote.text',
          'growth-track.quote.reference'
        ]);

      if (error) throw error;

      if (textData) {
        const keyMap: Record<string, string> = {
          'growth-track.title': 'title',
          'growth-track.subtitle': 'subtitle',
          'growth-track.steps.title1': 'step1Title',
          'growth-track.steps.description1': 'step1Description',
          'growth-track.steps.title2': 'step2Title',
          'growth-track.steps.description2': 'step2Description',
          'growth-track.steps.title3': 'step3Title',
          'growth-track.steps.description3': 'step3Description',
          'growth-track.cet.title': 'cetTitle',
          'growth-track.cet.basic.title': 'cetBasicTitle',
          'growth-track.cet.basic.subtitle': 'cetBasicSubtitle',
          'growth-track.cet.basic.description': 'cetBasicDescription',
          'growth-track.cet.intermediate.title': 'cetIntermediateTitle',
          'growth-track.cet.intermediate.subtitle': 'cetIntermediateSubtitle',
          'growth-track.cet.intermediate.description': 'cetIntermediateDescription',
          'growth-track.cet.advanced.title': 'cetAdvancedTitle',
          'growth-track.cet.advanced.subtitle': 'cetAdvancedSubtitle',
          'growth-track.cet.advanced.description': 'cetAdvancedDescription',
          'growth-track.quote.text': 'quoteText',
          'growth-track.quote.reference': 'quoteReference'
        };

        const formattedData = textData.reduce((acc, item) => {
          const mappedKey = keyMap[item.key];
          if (mappedKey) {
            return { ...acc, [mappedKey]: item.value };
          }
          return acc;
        }, {
          title: '',
          subtitle: '',
          step1Title: '',
          step1Description: '',
          step2Title: '',
          step2Description: '',
          step3Title: '',
          step3Description: '',
          cetTitle: '',
          cetBasicTitle: '',
          cetBasicSubtitle: '',
          cetBasicDescription: '',
          cetIntermediateTitle: '',
          cetIntermediateSubtitle: '',
          cetIntermediateDescription: '',
          cetAdvancedTitle: '',
          cetAdvancedSubtitle: '',
          cetAdvancedDescription: '',
          quoteText: '',
          quoteReference: ''
        } as GrowthTrackData);

        setData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching growth track data:', error);
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

  const getIcon = (iconName: string) => {
    const icons = {
      Users,
      Coffee,
      Target
    };
    return icons[iconName as keyof typeof icons] || Users;
  };

  const handleCourseClick = () => {
    const searchParams = new URLSearchParams();
    searchParams.append('searchTerm', 'CET');
    navigate({
      pathname: '/downloads',
      search: searchParams.toString()
    });
  };

  if (loading) {
    return <Loader />;
  }

  const steps = [
    {
      title: data.step1Title,
      description: data.step1Description,
      icon: 'Users'
    },
    {
      title: data.step2Title,
      description: data.step2Description,
      icon: 'Coffee'
    },
    {
      title: data.step3Title,
      description: data.step3Description,
      icon: 'Target'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-24">
      <motion.div 
        className="mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <h1 className="text-4xl md:text-7xl font-bold mb-4">{data.title}</h1>
          <p className="text-gray-600 text-xl md:text-3xl max-w-2xl mx-auto px-4">
            {data.subtitle}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mb-12"
          variants={itemVariants}
        >
          {steps.map((step) => {
            const StepIcon = getIcon(step.icon);
            return (
              <motion.div
                key={step.title}
                className="bg-white rounded-2xl overflow-hidden hover:bg-gray-50 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="flex-1 space-y-2 justify-center items-center text-center">
                      <div className="flex items-center justify-center gap-8 mb-4">
                        <div className="bg-secondary/10 p-4 rounded-xl shrink-0">
                          <StepIcon className="w-8 h-8 text-secondary" />
                        </div>
                        <h3 className="text-2xl md:text-5xl font-semibold">{step.title}</h3>
                      </div>
                      <p className="text-gray-600 text-lg md:text-3xl leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-2xl overflow-hidden p-6 mb-8">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
              <div className="bg-secondary/10 p-3 rounded-lg shrink-0">
                <BookOpen className="w-8 h-8 text-secondary" />
              </div>
              <h2 className="text-4xl md:text-7xl font-semibold text-center sm:text-left">
                {data.cetTitle}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: data.cetBasicTitle,
                  subtitle: data.cetBasicSubtitle,
                  description: data.cetBasicDescription
                },
                {
                  title: data.cetIntermediateTitle,
                  subtitle: data.cetIntermediateSubtitle,
                  description: data.cetIntermediateDescription
                },
                {
                  title: data.cetAdvancedTitle,
                  subtitle: data.cetAdvancedSubtitle,
                  description: data.cetAdvancedDescription
                }
              ].map((course) => (
                <div
                  key={course.title}
                  onClick={handleCourseClick}
                  className="cursor-pointer group relative"
                >
                  <motion.div
                    className="bg-gray-50 rounded-xl p-12 flex flex-col justify-center items-center text-center gap-4 transition-colors duration-300"
                    whileHover={{ scale: 1.03 }}
                  >
                    <h3 className="text-2xl md:text-5xl font-semibold mb-2">{course.title}</h3>
                    <p className="text-secondary font-medium text-xl md:text-3xl mb-2">{course.subtitle}</p>
                    <p className="text-gray-600 text-lg md:text-3xl">{course.description}</p>
                    
                    <div className="absolute inset-0 bg-secondary/90 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                      <ArrowDownToLine className="w-8 h-8 text-white mb-3 animate-bounce" />
                      <p className="text-white text-center font-medium text-xl md:text-3xl">
                        Clique para acessar os materiais do curso
                      </p>
                      <p className="text-white/80 text-lg md:text-3xl mt-2">
                        Apostilas e recursos disponíveis
                      </p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}