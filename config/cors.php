<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // 'allowed_origins' => [env("FRONTEND_URL")],
    'allowed_origins' => ['http://192.168.43.206:8080', 'http://localhost:8080'],


    // 'allowed_origins' => [
    // env("FRONTEND_URL"),
    // 'https://192.168.43.206:8080',
    // 'https://localhost:8080',
    // 'https://b855-2c0f-fe38-2333-5aa1-f812-ad28-21bc-3a13.ngrok-free.app',
    // ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];
