/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAINTAINER_EMAIL?: string;
  readonly VITE_SITE_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
