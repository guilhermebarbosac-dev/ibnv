import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LiveSectionProps {
  title: string;
  description: string;
  isLiveStreaming: boolean;
  liveVideoId: string;
  recentVideos: { id: string }[];
}

export function LiveSection({ title, description, isLiveStreaming, liveVideoId, recentVideos }: LiveSectionProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);


  useEffect(() => {
    if (isLiveStreaming && iframeRef.current) {
      iframeRef.current.src = `https://www.youtube.com/embed/${liveVideoId}?autoplay=1&mute=1`;
    }
  }, [isLiveStreaming, liveVideoId]);

  return (
    <motion.section
      className="py-16 bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full mx-auto px-4">
        <motion.h2
          className="text-7xl font-bold text-center mb-4"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-gray-600 text-3xl text-center mb-8 max-w-2xl mx-auto"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {description}
        </motion.p>

        {isLiveStreaming ? (
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="font-bold text-red-500">AO VIVO</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="font-bold text-gray-500">TRANSMISSÃO OFFLINE</span>
          </div>
        )}

        <motion.div
          className="w-full aspect-w-16 aspect-h-9 mb-4 md:h-[90vh] h-[30vh]"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <iframe
            ref={iframeRef}
            src={`https://www.youtube.com/embed/${isLiveStreaming ? liveVideoId : recentVideos[0]?.id}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg shadow-lg"
          ></iframe>
        </motion.div>
{/* 
        <motion.div
          className="flex flex-col md:grid md:grid-cols-3 gap-4 h-[60vh] md:h-[40vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          {recentVideos.slice(1).map((video) => (
            <motion.div
              key={video.id}
              className="aspect-w-16 aspect-h-16 md:aspect-w-1 md:aspect-h-1 md:h-[40vh] h-[30vh]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${video.id}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              ></iframe>
            </motion.div>
          ))}
        </motion.div> */}
      </div>
    </motion.section>
  );
}
