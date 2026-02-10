import React, { useRef, useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import img1 from "../assets/first.png"
import img2 from "../assets/second.png"
import img3 from "../assets/third.png"
import img4 from "../assets/four.png"
import img5 from "../assets/five.png"






const FullWidthCarousel = () => {
  const autoplay = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false })
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
    <div className="w-full flex flex-col items-center">
      
      <div className="embla w-full overflow-hidden">
        <div
          className="embla__viewport w-full h-64 sm:h-80 md:h-96"
          ref={emblaRef}
        >
          <div className="embla__container flex h-full">
            {images.map((src, index) => (
              <div key={index} className="embla__slide min-w-full h-full">
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-3 space-x-2">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === selectedIndex ? "bg-blue-600" : "bg-gray-300"
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default FullWidthCarousel;
