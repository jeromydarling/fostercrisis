/// <reference types="vite/client" />

// Raw imports — used for reading markdown content at build time into
// static string modules. See src/components/Md.tsx for the renderer.
declare module '*?raw' {
  const content: string;
  export default content;
}
