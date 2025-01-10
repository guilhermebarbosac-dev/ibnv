import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Button {
  label: string;
  link: string;
}

interface InfoSectionProps {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  reverse?: boolean;
  children?: React.ReactNode;
  buttons?: Button[];
}

export function InfoSection({ 
  title, 
  description, 
  imageUrl, 
  imageAlt,
  reverse = false,
  children,
  buttons
}: InfoSectionProps) {
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const hasImage = imageUrl && imageAlt;

  return (
    <motion.section 
      className={`${reverse ? 'bg-gray-50' : 'bg-primary text-white'} py-16 sm:py-24 px-4 w-full`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeInVariants}
    >
      <div className="w-full">
        <div className={`grid ${hasImage ? 'md:grid-cols-2' : 'grid-cols-1'} gap-12 md:gap-16 items-center ${reverse ? 'md:grid-flow-col' : ''}`}>
          <div className={`flex items-center justify-center ${hasImage && reverse ? 'md:col-start-2 md:col-end-3' : ''} ${!hasImage ? 'col-span-full' : ''}`}>
            <div className="text-center w-full space-y-8">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">{title}</h2>
              <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed">{description}</p>
              {buttons && buttons.length > 0 && (
                <div className="pt-4 flex flex-wrap gap-4 justify-center">
                  {buttons.map((button, index) => (
                    <Link 
                      key={index}
                      to={button.link}
                      className="inline-block bg-secondary text-white px-8 py-3 rounded-full font-medium
                               hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
                    >
                      {button.label}
                    </Link>
                  ))}
                </div>
              )}
              {children && (
                <div className="pt-4">
                  {children}
                </div>
              )}
            </div>
          </div>
          {hasImage && (
            <div className={`flex items-center justify-center w-full ${reverse ? 'md:col-start-1 md:col-end-2 md:row-start-1' : ''}`}>
              <img
                src={imageUrl}
                alt={imageAlt}
                className="rounded-lg shadow-lg w-full h-auto object-cover max-h-[600px]"
              />
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}