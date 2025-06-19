
interface ImageGalleryProps {
  images: string[];
  smallImagePosition?: "left" | "right"
  largeImagePosition?: "left" | "right"
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images,  smallImagePosition = "left", largeImagePosition = "right" }) => {

    if (images.length < 2) {
      return (
        <div className="w-[300px] h-[400px] relative">
          {images.length > 0 && (
            <img
              src={images[0] || "/placeholder.svg?height=400&width=300"}
              alt="Cleaning service"
              className="object-cover rounded-2xl shadow-lg"
            />
          )}
        </div>
      )
    }

    return (
    <div className="relative w-full h-[420px]">
      {/* Large Image */}
      <div
        className={`absolute max-w-[400px] max-h-[400px] ${largeImagePosition === "right" ? "right-0 top-0" : "left-0 top-0"}`}
      >
        <img
          src={images[1] || "/placeholder.svg?height=320&width=280"}
          alt="Professional cleaning service"
          className="object-cover rounded-2xl shadow-lg"
        />
        {/* <div className="relative w-full h-full">
        </div> */}
      </div>

      {/* Small Image - Overlapping */}
      <div
        className={`absolute max-w-[260px] max-h-[260px] z-10 ${
          smallImagePosition === "left" ? "left-10 sm:left-18 md:left-20 lg:left-24 bottom-0" : " right-10 sm:right-20 bottom-0"
        }`}
      >
        <img
          src={images[0] || "/placeholder.svg?height=240&width=200"}
          alt="Cleaning in action"
          className="object-cover rounded-2xl shadow-xl border-4 border-white"
        />
        {/* <div className="relative w-full h-full">
        </div> */}
      </div>
    </div>
  );
};
