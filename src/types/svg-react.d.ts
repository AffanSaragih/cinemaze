// Import sebagai URL
declare module '*.svg' {
  const src: string;
  export default src;
}

// Import sebagai React component via vite-plugin-svgr (?react)
declare module '*.svg?react' {
  import * as React from 'react';
  const Component: React.FC<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  export default Component;
}
