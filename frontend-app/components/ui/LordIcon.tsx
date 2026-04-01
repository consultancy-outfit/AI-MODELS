'use client';

import { createElement } from 'react';

type LordIconProps = {
  src: string;
  trigger?: string;
  colors?: string;
  size?: number | string;
  state?: string;
  style?: React.CSSProperties;
};

export function LordIcon({
  src,
  trigger = 'hover',
  colors = 'primary:#C8622A,secondary:#1E4DA8',
  size = 22,
  state,
  style,
}: LordIconProps) {
  return createElement('lord-icon', {
    src,
    trigger,
    colors,
    state,
    style: {
      width: typeof size === 'number' ? `${size}px` : size,
      height: typeof size === 'number' ? `${size}px` : size,
      display: 'inline-block',
      ...style,
    },
  });
}
