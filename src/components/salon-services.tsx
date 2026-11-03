"use client"

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import {
  CutoutCard, CutoutCardAction, CutoutCardContent, CutoutCardFooter,
  CutoutCardImage, CutoutCardInsetLabel, CutoutCardMedia, CutoutCardOverlay,
  CutoutCardPin, CutoutCorner, cutoutCardSurfaceClassName, useCutoutContentStaggerVariants,
} from '@/components/ui/cutout-card';

const services = [
  { id: 'haircut', title: 'Haircut & Styling', tag: 'YOUR SIGNATURE LOOK', audience: 'Women, men & kids', description: 'Precision cuts, fresh blowouts and effortless styling. A look that feels completely you.', alt: '3D pink hairdryer, silver scissors and salon comb', tone: 'rose' },
  { id: 'hair-color', title: 'Hair Color & Treatments', tag: 'COLOUR WITH CONFIDENCE', audience: 'Colour & hair rituals', description: 'From subtle highlights to a whole new shade, with nourishing care for beautiful, glossy hair.', alt: '3D hair colour bowl, tint brush, treatment bottle and glossy hair swatch', tone: 'peach' },
  { id: 'facial', title: 'Skin & Facial Care', tag: 'A MOMENT TO GLOW', audience: 'Skin & self-care', description: 'Unwind with cleansing facials and skin rituals that leave you feeling refreshed and radiant.', alt: '3D facial cream, jade gua sha, spa towel and serum bottle', tone: 'sage' },
  { id: 'makeup', title: 'Bridal & Party Makeup', tag: 'MADE FOR YOUR MOMENT', audience: 'Bridal & celebrations', description: 'Soft glamour or a statement look. Thoughtful makeup for your most memorable moments.', alt: '3D luxury makeup brush, lipstick, eyeshadow and bridal pearl hairpin', tone: 'lilac' },
  { id: 'nails', title: 'Nail & Beauty Care', tag: 'THE FINISHING TOUCH', audience: 'Nails & beauty rituals', description: 'Beautiful nails, polished details and a little everyday indulgence, all in one place.', alt: '3D blush and berry nail polish bottles, manicure file and beauty cream', tone: 'pink' },
  { id: 'grooming', title: "Men’s Grooming", tag: 'SHARP IN EVERY DETAIL', audience: 'Hair, beard & grooming', description: 'Clean fades, tailored beard shaping and classic grooming. Leave looking sharp and feeling fresh.', alt: '3D electric clipper, chrome razor, shaving brush and beard oil', tone: 'sand' },
];

export function SalonServices() {
  const stagger = useCutoutContentStaggerVariants();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    const media = window.matchMedia('(max-width: 600px)');
    let frame = 0;
    const update = () => {
      const slides = Array.from(slider.children) as HTMLElement[];
      const center = slider.scrollLeft + slider.clientWidth / 2;
      let nearest = 0;
      let smallest = Infinity;
      slides.forEach((slide, index) => {
        const distance = media.matches ? (slide.offsetLeft + slide.offsetWidth / 2 - center) / slide.offsetWidth : 0;
        slide.style.setProperty('--slide-distance', String(Math.max(-1, Math.min(1, distance))));
        if (Math.abs(distance) < smallest) { smallest = Math.abs(distance); nearest = index; }
      });
      setActiveSlide(nearest);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    slider.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    update();
    return () => { cancelAnimationFrame(frame); slider.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); };
  }, []);
  const goToSlide = (index: number) => {
    const slider = sliderRef.current;
    const slide = slider?.children[index] as HTMLElement | undefined;
    if (!slider || !slide) return;
    slider.scrollTo({ left: slide.offsetLeft - (slider.clientWidth - slide.offsetWidth) / 2, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return <section id="our-services" className="salon-services" aria-labelledby="salon-services-title">
    <div className="salon-services-inner">
      <header className="salon-services-heading">
        <div><p className="salon-services-eyebrow"><span /> THE BLOSSOM EXPERIENCE</p>
          <h2 id="salon-services-title">Our <em>Services.</em></h2></div>
        <p>A little refresh. A big transformation.<br />Expert care for every version of you.</p>
      </header>
      <div ref={sliderRef} className="salon-services-grid" role="region" aria-label="Our services cards" tabIndex={0} onKeyDown={event => {
        if (!window.matchMedia('(max-width: 600px)').matches) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); goToSlide(Math.max(0, Math.min(services.length - 1, activeSlide + (event.key === 'ArrowRight' ? 1 : -1)))); }
      }}>
        {services.map((service, index) => <div className="service-slide" key={service.id}><CutoutCard className={`${cutoutCardSurfaceClassName} service-tone-${service.tone}`}>
          <CutoutCardMedia>
            <CutoutCardOverlay />
            <CutoutCardImage src={`/images/services/${service.id}.png`} alt={service.alt} width={1024} height={1024} sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 400px" />
            <CutoutCardInsetLabel><span>{service.tag}</span><CutoutCorner size={25} className="service-label-corner-right" /><CutoutCorner size={25} className="service-label-corner-top" /></CutoutCardInsetLabel>
            <CutoutCardPin><span>0{index + 1}</span><CutoutCorner className="service-pin-corner-left" /><CutoutCorner className="service-pin-corner-bottom" /></CutoutCardPin>
          </CutoutCardMedia>
          <CutoutCardContent>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: .2 }} variants={stagger.container}>
              <motion.h3 variants={stagger.item}>{service.title}</motion.h3>
              <motion.p variants={stagger.item}>{service.description}</motion.p>
              <motion.div variants={stagger.item}><CutoutCardFooter><span>{service.audience}</span></CutoutCardFooter></motion.div>
            </motion.div>
          </CutoutCardContent>
          <CutoutCardAction><a href="#footer" aria-label={`Enquire about ${service.title}`}><ArrowUpRight size={20} /></a></CutoutCardAction>
        </CutoutCard></div>)}
      </div>
      <div className="services-slider-controls">
        <button type="button" onClick={() => goToSlide(activeSlide - 1)} disabled={activeSlide === 0} aria-label="Previous service"><ArrowLeft size={17} /></button>
        <div className="services-slider-dots">{services.map((service, index) => <button type="button" key={service.id} aria-label={`Show ${service.title}`} aria-current={activeSlide === index ? 'true' : undefined} onClick={() => goToSlide(index)} />)}</div>
        <button type="button" onClick={() => goToSlide(activeSlide + 1)} disabled={activeSlide === services.length - 1} aria-label="Next service"><ArrowRight size={17} /></button>
      </div>
      <p className="salon-services-note">Not sure where to start? <a href="#footer">Let’s find your perfect service <ArrowUpRight size={14} /></a></p>
    </div>
  </section>;
}
