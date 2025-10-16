import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

interface PhotoGalleryProps {
  images: string[];
  heroImage?: string;
  alt?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ images, heroImage, alt = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const allImages = heroImage && !images.includes(heroImage) 
    ? [heroImage, ...images] 
    : images;

  const slides = allImages.map(img => ({ src: img }));

  const handleHeroClick = () => {
    setPhotoIndex(0);
    setIsOpen(true);
  };

  if (!heroImage && images.length === 0) {
    return null;
  }

  return (
    <>
      {heroImage && (
        <div 
          className="cursor-pointer relative group overflow-hidden"
          onClick={handleHeroClick}
        >
          <img
            src={heroImage}
            alt={alt}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {allImages.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{allImages.length}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        slides={slides}
        index={photoIndex}
      />
    </>
  );
};

export default PhotoGallery;
