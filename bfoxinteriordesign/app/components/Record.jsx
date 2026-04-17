'use client';

import Image from 'next/image';

export const RecordColors = {
  rust: '#AE6027',
  plum: '#6B3144',
  slate: '#485A7A',
  espresso: '#411F12',
};

const ASPECT = 646 / 350;
const INNER_RATIO = 150 / 350;
const SLEEVE_TOP_RATIO = 296 / 350;

export default function Record({
  size = 350,
  accentColor = RecordColors.rust,
  image,
  alt = '',
  className,
  style,
}) {
  const width = size;
  const height = size * ASPECT;
  const innerSize = size * INNER_RATIO;
  const innerOffset = (size - innerSize) / 2;
  const sleeveTop = size * SLEEVE_TOP_RATIO;

  return (
    <div
      className={className}
      style={{ position: 'relative', width, height, ...style }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size,
          height: size,
          background: 'black',
          borderRadius: '9999px',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: innerOffset,
          left: innerOffset,
          width: innerSize,
          height: innerSize,
          background: accentColor,
          borderRadius: '9999px',
        }}
      />
      {image && (
        <div
          style={{
            position: 'absolute',
            top: sleeveTop,
            left: 0,
            width: size,
            height: size,
            overflow: 'hidden',
          }}
        >
          <Image src={image} alt={alt} fill sizes={`${size}px`} style={{ objectFit: 'cover' }} />
        </div>
      )}
    </div>
  );
}
