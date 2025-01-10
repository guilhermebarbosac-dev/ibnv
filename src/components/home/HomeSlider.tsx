import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { EmptyState } from '../EmptyState';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../../styles/swiper.css';
import { ImageIcon } from 'lucide-react';
import { useWebsiteTexts } from '../../constants/textsData';
import { Loader } from '../ui/Loader';

interface Slide {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

interface HomeSliderProps {
  slides: Slide[];
}

export function HomeSlider({ slides }: HomeSliderProps) {
  const { loading } = useWebsiteTexts();

  if (loading) {
    return <Loader />;
  }

  if (slides.length === 0) {
    return (
      <div className="py-16 px-4 h-screen flex items-center justify-center">
        <div className="container mx-auto">
          <EmptyState
            icon={ImageIcon}
            title="Sem slides disponíveis"
            message="Nenhum slide foi adicionado ainda."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[90vh]">
      {/* Fixed text overlay - Now positioned lower */}
      {/* <div className="absolute inset-0 z-10 flex items-end justify-center pointer-events-none pb-32">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
            {titleSlidesHome.slidesInfoHome.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 drop-shadow-md">
            {titleSlidesHome.slidesInfoHome.description}
          </p>
          <div className="pointer-events-auto">
            <Link 
              to="/quem-somos" 
              className="inline-block bg-secondary text-white px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              {titleSlidesHome.slidesInfoHome.labelButton}
            </Link>
          </div>
        </div>
      </div> */}

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className="w-full h-full bg-center bg-cover bg-no-repeat relative"
              style={{ backgroundImage: `url(${slide.image_url})` }}
            >
              <div className="absolute inset-0" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}