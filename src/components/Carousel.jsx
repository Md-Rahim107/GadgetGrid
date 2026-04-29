import { useEffect, useState, useRef } from 'react';

const SLIDES = [
  { tag: '🔥 Flash Deal – 48 hrs only', title: 'Next-Gen<br/>Smartphones', sub: 'Unleash the power of cutting-edge mobile technology. Up to 40% off on flagship models this weekend.', cta: 'Shop Now →', emoji: '📱' },
  { tag: '💜 New Collection',           title: 'Pro Laptops<br/>Arrived',     sub: 'From creators to coders — find your perfect machine. Starting at unbeatable prices.', cta: 'Explore →', emoji: '💻' },
  { tag: '🎧 Audio Week',               title: 'Hear Every<br/>Detail',       sub: 'Premium headphones & earbuds with noise cancellation. Lose yourself in the music.', cta: 'Listen Now →', emoji: '🎧' },
  { tag: '⌚ Wearable Tech',            title: 'Wear the<br/>Future',         sub: 'Smartwatches and fitness trackers that keep you ahead — stylish yet powerful.', cta: 'View All →', emoji: '⌚' },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const goTo = (n) => setCurrent(((n % SLIDES.length) + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), 4500);
    return () => clearInterval(timerRef.current);
  }, [current]);

  return (
    <section className="carousel-section" aria-label="Featured promotions">
      <div className="carousel-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {SLIDES.map((s, i) => (
          <div key={i} className={`slide slide-${i + 1}`}>
            <div className="slide-glow" />
            <div className="slide-content">
              <div className="slide-tag">{s.tag}</div>
              <h2 className="slide-title" dangerouslySetInnerHTML={{ __html: s.title }} />
              <p className="slide-sub">{s.sub}</p>
              <a href="#products" className="slide-cta">{s.cta}</a>
            </div>
            <div className="slide-image" aria-hidden="true">{s.emoji}</div>
          </div>
        ))}
      </div>
      <button className="carousel-arrow left" onClick={() => goTo(current - 1)} aria-label="Previous">‹</button>
      <button className="carousel-arrow right" onClick={() => goTo(current + 1)} aria-label="Next">›</button>
      <div className="carousel-nav">
        {SLIDES.map((_, i) => (
          <button key={i} className={`dot ${i === current ? 'active' : ''}`} onClick={() => goTo(i)} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </section>
  );
}
