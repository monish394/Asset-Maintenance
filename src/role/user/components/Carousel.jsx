import React, { useRef, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import img1 from "../assets/first1.png"
import img2 from "../assets/second.png"
import img3 from "../assets/third.png"
import img4 from "../assets/four.png"
import img5 from "../assets/five.png"






const FullWidthCarousel = () => {
  const autoplay = useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplay.current,
  ]);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi]);

  const scrollTo = (index) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  };
  const images = [
    img1,
    img2,
    img4,
    img5,
    img3
  ];

  return (
    <div className="w-full relative group">
      <div className="embla w-full overflow-hidden rounded-xl md:rounded-3xl shadow-lg border border-gray-100 bg-[#121212]">
        <div
          className="embla__viewport w-full h-[300px] sm:h-[300px] md:h-[420px] lg:h-[420px]"
          ref={emblaRef}
        >
          <div className="embla__container flex h-full">
            {images.map((src, index) => (
              <div key={index} className="embla__slide min-w-full h-full flex items-center justify-center">
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className={`w-full h-full select-none ${index === 0 ? "object-cover object-left md:object-center" : "object-cover"
                    }`}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center space-x-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`transition-all duration-300 rounded-full ${index === selectedIndex ? "w-5 h-1.5 bg-white shadow-sm" : "w-1.5 h-1.5 bg-white/50"
              }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FullWidthCarousel;
