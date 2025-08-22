import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import type { Swiper as SwiperClass } from 'swiper/types';

import styles from './TrendingNow.module.scss';
import { CarouselArrow } from '@/components/ui/CarouselArrow';
import { MovieCardPreview } from '@/components/ui/MovieCardPreview';
import { BaseMovie } from '@/types/movie';

export const TrendingNow: React.FC<{ movies: BaseMovie[] }> = ({ movies }) => {
  const prevRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperClass | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(7);

  useEffect(() => {
    const updateSlides = () => {
      const width = window.innerWidth;
      if (width < 480) return setSlidesPerView(2);
      if (width < 768) return setSlidesPerView(3);
      if (width < 1024) return setSlidesPerView(4);
      setSlidesPerView(7);
    };
    updateSlides();
    window.addEventListener('resize', updateSlides);
    return () => window.removeEventListener('resize', updateSlides);
  }, []);

  const totalDots = movies.length;

  return (
    <div className={`${styles.trendingSection} container`}>
      <h2>Trending Now</h2>
      <div className={styles.carouselWrapper}>
        <div ref={prevRef}>
          <CarouselArrow direction='left' />
        </div>

        <Swiper
          modules={[Navigation, Mousewheel]}
          loop={true}
          spaceBetween={10}
          slidesPerView={slidesPerView}
          grabCursor={true}
          allowTouchMove={true}
          mousewheel={{ forceToAxis: true }}
          navigation={{
            prevEl: prevRef.current!,
            nextEl: nextRef.current!,
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          onBeforeInit={(swiper) => {
            if (
              swiper.params.navigation &&
              typeof swiper.params.navigation !== 'boolean'
            ) {
              swiper.params.navigation.prevEl = prevRef.current!;
              swiper.params.navigation.nextEl = nextRef.current!;
            }
          }}
        >
          {movies.map((movie, index) => (
            <SwiperSlide key={movie.id}>
              <MovieCardPreview {...movie} isTrending index={index} hideActions />
            </SwiperSlide>
          ))}
        </Swiper>

        <div ref={nextRef}>
          <CarouselArrow direction='right' />
        </div>
      </div>

      <div className={styles.customPagination}>
        {[...Array(totalDots)].map((_, index) => (
          <span
            key={index}
            className={`${styles.bullet} ${
              index === activeIndex ? styles.activeBullet : ''
            }`}
            onClick={() => swiperRef.current?.slideToLoop(index)}
          />
        ))}
      </div>
    </div>
  );
};
