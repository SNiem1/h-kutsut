import React from 'react';

interface TulipProps {
  className?: string;
  size?: number;
  budColor?: string;
  leafColor?: string;
}

export const TulipSingle: React.FC<TulipProps> = ({
  className = '',
  size = 48,
  budColor = '#FDF7CA',
  leafColor = '#C3CFB5',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      {/* Stem */}
      <path
        d="M50 45 C48 60, 48 80, 50 95"
        stroke={leafColor}
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      
      {/* Leaf Left */}
      <path
        d="M50 80 C35 70, 32 55, 42 50 C45 52, 48 62, 50 80Z"
        fill={leafColor}
        opacity="0.85"
      />
      
      {/* Leaf Right */}
      <path
        d="M50 70 C65 62, 68 48, 58 42 C55 45, 52 55, 50 70Z"
        fill={leafColor}
        opacity="0.9"
      />

      {/* Flower Bud */}
      {/* Back petals */}
      <path
        d="M33 35 C38 12, 62 12, 67 35 C58 48, 42 48, 33 35Z"
        fill={budColor}
        opacity="0.7"
      />
      
      {/* Main Left Petal */}
      <path
        d="M30 35 C32 15, 52 18, 52 46 C42 48, 32 45, 30 35Z"
        fill={budColor}
        stroke="#E6DEC3"
        strokeWidth="0.5"
      />
      
      {/* Main Right Petal */}
      <path
        d="M70 35 C68 15, 48 18, 48 46 C58 48, 68 45, 70 35Z"
        fill={budColor}
        stroke="#E6DEC3"
        strokeWidth="0.5"
      />

      {/* Front Center Petal */}
      <path
        d="M38 38 C42 18, 58 18, 62 38 C54 49, 46 49, 38 38Z"
        fill={budColor}
        stroke="#D9CFA6"
        strokeWidth="0.75"
      />
    </svg>
  );
};

export const TulipBouquet: React.FC<TulipProps> = ({
  className = '',
  size = 120,
  budColor = '#FDF7CA',
  leafColor = '#C3CFB5',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
    >
      {/* Ribbon */}
      <path
        d="M50 75 C45 74, 40 85, 45 92 M70 75 C75 74, 80 85, 75 92"
        stroke="#B1C0A3"
        strokeWidth="2.5"
      />

      {/* Stems */}
      <path d="M48 55 L42 98" stroke={leafColor} strokeWidth="3" />
      <path d="M60 50 L60 102" stroke={leafColor} strokeWidth="3" />
      <path d="M72 55 L78 98" stroke={leafColor} strokeWidth="3" />

      {/* Leaves */}
      <path d="M30 80 C20 70, 38 52, 45 62Z" fill={leafColor} opacity="0.8" />
      <path d="M90 80 C100 70, 82 52, 75 62Z" fill={leafColor} opacity="0.8" />
      
      {/* Left Tulip */}
      <g transform="translate(15, 10) rotate(-15 35 35)">
        <path d="M30 40 C32 18, 52 20, 50 48 C40 50, 32 48, 30 40Z" fill={budColor} />
        <path d="M50 40 C48 18, 28 20, 30 48 C40 50, 48 48, 50 40Z" fill={budColor} opacity="0.9" />
        <path d="M34 42 C38 23, 46 23, 46 42 C42 48, 38 48, 34 42Z" fill="#FFFBE5" />
      </g>

      {/* Right Tulip */}
      <g transform="translate(45, 10) rotate(15 35 35)">
        <path d="M30 40 C32 18, 52 20, 50 48 C40 50, 32 48, 30 40Z" fill={budColor} />
        <path d="M50 40 C48 18, 28 20, 30 48 C40 50, 48 48, 50 40Z" fill={budColor} opacity="0.9" />
        <path d="M34 42 C38 23, 46 23, 46 42 C42 48, 38 48, 34 42Z" fill="#FFFBE5" />
      </g>

      {/* Center Tulip - Higher */}
      <g transform="translate(30, -5)">
        <path d="M30 40 C32 16, 52 18, 50 48 C40 50, 32 48, 30 40Z" fill={budColor} />
        <path d="M50 40 C48 16, 28 18, 30 48 C40 50, 48 48, 50 40Z" fill={budColor} opacity="0.85" />
        <path d="M34 42 C38 20, 46 20, 46 42 C42 49, 38 49, 34 42Z" fill="#FFFBD0" />
      </g>
      
      {/* Little Tie-knot */}
      <path
        d="M52 75 C55 72, 65 72, 68 75 C62 76, 58 76, 52 75Z"
        fill="#879977"
      />
    </svg>
  );
};

export const TulipDivider: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#C3CFB5',
}) => {
  return (
    <div className={`flex items-center justify-center w-full gap-4 ${className}`}>
      <div className="h-[1px] flex-1 max-w-[150px]" style={{ backgroundColor: `${color}80` }} />
      <TulipSingle size={28} />
      <div className="h-[1px] flex-1 max-w-[150px]" style={{ backgroundColor: `${color}80` }} />
    </div>
  );
};

export const TulipCorner: React.FC<{ className?: string; color?: string; flipX?: boolean; flipY?: boolean }> = ({
  className = '',
  color = '#C3CFB5',
  flipX = false,
  flipY = false,
}) => {
  const transform = `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`;
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform }}
      className={`select-none pointer-events-none opacity-40 ${className}`}
    >
      {/* Corner borders */}
      <path d="M10 40 L10 10 L40 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Elegant branch curling */}
      <path d="M10 10 Q35 15, 30 35 Q25 45, 15 55" stroke={color} strokeWidth="1" strokeLinecap="round" />
      <path d="M10 10 Q15 35, 35 30 Q45 25, 55 15" stroke={color} strokeWidth="1" strokeLinecap="round" />
      {/* Mini Tulip bud */}
      <path d="M28 35 C31 32, 33 34, 30 39 C28 37, 27 36, 28 35Z" fill="#FDF7CA" />
    </svg>
  );
};
