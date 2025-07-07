import React from 'react';

interface HeartIconProps {
  filled?: boolean;
  size?: number;
  className?: string; // ← tambahkan
}

export const HeartIcon: React.FC<HeartIconProps> = ({
  filled = false,
  size = 18.86,
  className,
}) => (
  <svg
    className={className} // ← pasang className
    xmlns='http://www.w3.org/2000/svg'
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill={filled ? '#E41D02' : 'none'}
    stroke={filled ? '#E41D02' : '#999'}
    strokeWidth={1.5}
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <g transform='translate(0.6,1)'>
      <path d='M12.62 20.8101C12.28 20.9301 11.72 20.9301 11.38 20.8101C8.48 19.8201 2 15.6901 2 8.6901C2 5.6001 4.49 3.1001 7.56 3.1001C9.38 3.1001 10.99 3.9801 12 5.3401C13.01 3.9801 14.63 3.1001 16.44 3.1001C19.51 3.1001 22 5.6001 22 8.6901C22 15.6901 15.52 19.8201 12.62 20.8101Z' />
    </g>
  </svg>
);
