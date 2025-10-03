<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Configuración CORS para CatWare Systems
    | Permite requests desde React frontend (localhost:5173)
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',  // React Vite dev server (puerto por defecto)
        'http://localhost:5174',  // React Vite dev server (puerto alternativo)
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://localhost:3000',  // Por si usas otro puerto
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];