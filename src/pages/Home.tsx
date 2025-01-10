import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useRealtimeSubscription } from '../hooks/useRealtimeSubscription';
import { HomeSlider } from '../components/home/HomeSlider';
import { EventsSection } from '../components/home/EventsSection';
import { InfoSection } from '../components/home/InfoSection';
import { LoaderSpinner } from '../components/ui/Loader-spinner';
import { LiveSection } from '../components/home/LiveSection';
import { EstudosSection } from '../components/home/EstudosSection';
import { useYouTubeChannel } from '../hooks/useYouTubeChannel';
import { useWebsiteTexts } from '../constants/textsData';
import { Estudo } from '../types/Estudo';

interface Slide {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  image_url: string;
  is_cancelled: boolean;
}

export function Home() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [estudos, setEstudos] = useState<Estudo[]>([]);
  const [loading, setLoading] = useState(true);
  const { websiteTexts, loading: textsLoading } = useWebsiteTexts();

  const { isLiveStreaming, liveVideoId, recentVideos } = useYouTubeChannel();

  const fetchSlides = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('slides')
        .select('*')
        .eq('is_active', true)
        .order('order');

      if (error) throw error;
      setSlides(data || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_cancelled', false)
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(3);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }, []);

  const fetchEstudos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('estudos')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setEstudos(data || []);
    } catch (error) {
      console.error('Error fetching estudos:', error);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchSlides(), fetchEvents(), fetchEstudos()]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchSlides, fetchEvents, fetchEstudos]);

  useRealtimeSubscription('slides', fetchSlides);
  useRealtimeSubscription('events', fetchEvents);
  useRealtimeSubscription('estudos', fetchEstudos);

  if(loading || textsLoading){
    return (
      <LoaderSpinner/>
    )
  }

  const { infoSectionsHome } = websiteTexts;

  return (
    <div className="flex flex-col">
      <HomeSlider slides={slides} />
      <InfoSection
        title={infoSectionsHome.context.bemVindo.title || 'Bem-vindo à Igreja Batista Nova Vida'}
        description={infoSectionsHome.context.bemVindo.description || 'Seja bem-vindo à Igreja Batista Nova Vida! Aqui, você encontrará um ambiente acolhedor e inspirador, onde você pode explorar a fé e se conectar com outros membros da comunidade cristã. Nossa igreja é um lugar onde você pode encontrar apoio, amor e crescimento espiritual. Venha conhecer nossa história e como podemos ajudar você a encontrar a paz e a alegria que Jesus oferece. Junte-se a nós e comece a explorar o que a Igreja Batista Nova Vida pode oferecer para você e sua família.'}
        imageAlt="Igreja" 
        buttons={infoSectionsHome.context.bemVindo.buttons}
      />
      <EventsSection events={events} loading={loading} />
      <LiveSection
        title={isLiveStreaming ? infoSectionsHome.transmission.aoVivo.title : infoSectionsHome.transmission.canalYoutube.title}
        description={isLiveStreaming ? infoSectionsHome.transmission.aoVivo.description : infoSectionsHome.transmission.canalYoutube.description}
        isLiveStreaming={isLiveStreaming}
        liveVideoId={liveVideoId || ''}
        recentVideos={recentVideos}
      />
      <EstudosSection estudos={estudos} loading={loading} />
      <InfoSection
        title={infoSectionsHome.context.nossaIgreja.title}
        description={infoSectionsHome.context.nossaIgreja.description}
        imageUrl={infoSectionsHome.context.nossaIgreja.image}
        imageAlt="Igreja" 
      />

      <InfoSection
        title={infoSectionsHome.context.generosidade.title}
        description={infoSectionsHome.context.generosidade.description}
        imageUrl={infoSectionsHome.context.generosidade.image}
        imageAlt="Mãos unidas em gesto de generosidade"
        reverse
      >
        <Link 
          to="/generosidade"
          className="inline-block bg-secondary text-white px-8 py-3 rounded-full font-medium
                   hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
        >
          {infoSectionsHome.context.generosidade.labelButton}
        </Link>
      </InfoSection>
    </div>
  );
}