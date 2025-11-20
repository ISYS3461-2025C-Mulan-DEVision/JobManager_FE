interface ImportMetaEnv {
  readonly VITE_DEBUG_PRODUCTION?: string;
  readonly NODE_ENV?: string;
}

interface ImportMeta {
  glob: Function;
  readonly env: ImportMetaEnv;
}
