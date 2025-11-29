/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FLOW_API_KEY: string
    readonly VITE_FLOW_SECRET_KEY: string
    readonly VITE_FLOW_ENDPOINT: string
    readonly VITE_SUPABASE_URL: string
    readonly VITE_SUPABASE_ANON_KEY: string
    readonly VITE_GOOGLE_MAPS_API_KEY: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
