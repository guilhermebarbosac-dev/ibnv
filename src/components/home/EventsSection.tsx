import { motion } from 'framer-motion';
import { EmptyState } from '../EmptyState';
import { formatDate } from '../../utils/formatDate';
import { Ticket } from 'lucide-react';
import { LoaderSpinner } from '../ui/Loader-spinner';
import { useWebsiteTexts } from '../../constants/textsData';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  image_url: string;
  is_cancelled: boolean;
}

interface EventsSectionProps {
  events: Event[];
  loading?: boolean;
}

export function EventsSection({ events, loading = false }: EventsSectionProps) {
  const { websiteTexts, loading: textsLoading } = useWebsiteTexts();

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

  if (loading || textsLoading) {
    return (
      <LoaderSpinner />
    );
  }

  const { eventsHome } = websiteTexts;

  if (events.length === 0) {
    return (
      <section className="py-16 px-4 h-screen flex items-center justify-center w-full">
        <div className="w-full">
          <EmptyState
            icon={Ticket}
            title="Sem eventos próximos"
            message="Não há eventos programados para os próximos dias."
          />
        </div>
      </section>
    );
  }

  return (
    <motion.section 
      className="py-16 px-16 w-full"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <div className="w-full">
        <motion.h2 
          className="text-7xl font-bold text-center mb-12"
          variants={itemVariants}
        >
          {eventsHome.title}
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-8 lg:px-16">
          {events.map((event) => (
            <motion.div 
              key={event.id}
              variants={itemVariants}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-100 hover:-translate-y-1 hover:shadow-xl"
            >
              {event.image_url && (
                <div className="relative aspect-square">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-3xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-3 text-xl">
                  {formatDate(event.event_date)} às {event.event_time}
                </p>
                <p className="text-gray-600 text-xl">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}