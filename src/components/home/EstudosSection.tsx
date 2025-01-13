import { motion } from 'framer-motion';
import { EmptyState } from '../EmptyState';
import { formatDate } from '../../utils/formatDate';
import { Book, ChevronLeft, ChevronRight } from 'lucide-react';
import { LoaderSpinner } from '../ui/Loader-spinner';
import { useWebsiteTexts } from '../../constants/textsData';
import { Estudo } from '../../types/Estudo';
import { useRef } from 'react';

interface EstudosSectionProps {
  estudos: Estudo[];
  loading?: boolean;
}

export function EstudosSection({ estudos, loading = false }: EstudosSectionProps) {
  const { loading: textsLoading } = useWebsiteTexts();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
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
      transition: { duration: 0.3, ease: "easeOut" }
    }
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (loading || textsLoading) {
    return <LoaderSpinner />;
  }

  if (!estudos || estudos.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <EmptyState
          icon={Book}
          title="Nenhum estudo disponível"
          message="No momento não há estudos publicados."
        />
      </div>
    );
  }

  return (
    <section className="px-4 sm:px-24 bg-transparent">
      <motion.div
        className="w-full mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-7xl">
            Estudos de Células
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl sm:text-2xl text-gray-500 pb-16">
            Aprofunde seu conhecimento com nossos estudos semanais
          </p>
        </div>

        <div className="relative group p-4 bg-transparent">
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 p-2 bg-white/90 shadow-lg rounded-full text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-8 pb-4 px-12 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {estudos.map((estudo) => (
              <motion.div
                key={estudo.id}
                variants={itemVariants}
                className="flex-none w-[350px] bg-white rounded-lg overflow-hidden hover:bg-gray-50 transition-all duration-300"
              >
                <a
                  href={`/estudos/${estudo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={estudo.image_url}
                    alt={estudo.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {estudo.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {estudo.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {formatDate(estudo.created_at)}
                      </span>
                      {estudo.author && (
                        <span>
                          Por: {estudo.author}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 p-2 bg-white/90 shadow-lg rounded-full text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </section>
  );
} 