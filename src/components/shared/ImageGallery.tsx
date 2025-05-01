
interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="relative w-full max-w-md">
      {images.length > 0 && (
        <img
          src={images[0]}
          alt="Main"
          className="md:w-[100%] lg:w-[95%] xl:w-[85%] object-cover aspect-square"
        />
      )}
      {images.length > 1 && (
        <img
          src={images[1]}
          alt="Overlay" 
          className="absolute -bottom-20 w-[80%] -right-8 md:-bottom-20 md:w-[100%] md:-right-14 lg:bottom-10 lg:w-[90%] lg:-right-14 xl:-bottom-0 xl:-right-16 xl:w-[80%] border-12 border-white object-cover aspect-square"
        />
      )}
    </div>
  );
};
