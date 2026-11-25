import { useEffect, useState } from 'react';
import './App.css';
import { getImages, type Images } from './api';

function App() {
  const [images, setImages] = useState<Images[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getImages(controller.signal)
      .then((result) => {
        setImages(result);
        setError(null);
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) {
          setError(reason instanceof Error ? reason.message : 'Could not load images.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setActiveIndex((index) => (index + 1) % images.length);
  };

  if (loading) return <main className="carousel-page" aria-live="polite">Loading images…</main>;
  if (error) return <main className="carousel-page" role="alert">{error}</main>;
  if (images.length === 0) return <main className="carousel-page">No images available.</main>;

  const image = images[activeIndex];

  return (
    <main className="carousel-page">
      <h1>Image carousel</h1>
      <section className="carousel" aria-label="Image carousel">
        <button className="carousel-control" type="button" onClick={showPrevious} aria-label="Previous image">
          ‹
        </button>
        <figure className="carousel-slide" aria-live="polite">
          <img src={image.download_url} alt={`Photo by ${image.author}`} />
          <figcaption>
            <span>{image.author}</span>
            <span>{activeIndex + 1} / {images.length}</span>
          </figcaption>
        </figure>
        <button className="carousel-control" type="button" onClick={showNext} aria-label="Next image">
          ›
        </button>
      </section>
    </main>
  );
}

export default App;
