import Image from "next/image";

const positionClasses = {
  "top-left": "absolute top-8 left-8",
  "top-right": "absolute top-8 right-8",
  center: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  "bottom-right": "absolute bottom-8 right-8",
  "bottom-left": "absolute bottom-8 left-8",
};

const sizeClasses = {
  sm: "w-24 h-24",
  md: "w-40 h-40",
  lg: "w-64 h-64",
};

export default function VinylElement({ position = "top-right", size = "md" }) {
  const posClass = positionClasses[position] ?? positionClasses["top-right"];
  const sizeClass = sizeClasses[size] ?? sizeClasses["md"];

  return (
    <div className={`${posClass} ${sizeClass} pointer-events-none select-none`}>
      <Image
        src="/images/vinyl.png"
        alt="Decorative vinyl record"
        fill
        className="object-contain opacity-80"
      />
    </div>
  );
}
