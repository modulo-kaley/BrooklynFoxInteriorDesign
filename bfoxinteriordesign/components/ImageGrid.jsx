import Image from "next/image";

const layoutClasses = {
  "three-panel": "grid grid-cols-1 md:grid-cols-3 gap-4",
  "two-by-two": "grid grid-cols-1 md:grid-cols-2 gap-4",
  mixed: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
};

export default function ImageGrid({ images = [], layout = "three-panel", onImageClick }) {
  const gridClass = layoutClasses[layout] ?? layoutClasses["three-panel"];

  return (
    <div className={gridClass}>
      {images.map((image, index) => (
        <button
          key={`${image.src}-${index}`}
          type="button"
          onClick={() => onImageClick && onImageClick(image)}
          className="overflow-hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-500 ease-out hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
          {image.caption && (
            <p className="mt-1 text-xs text-gray-500">{image.caption}</p>
          )}
        </button>
      ))}
    </div>
  );
}
