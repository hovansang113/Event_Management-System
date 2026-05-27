<?php

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://event-management-system-attendee-fe.onrender.com',
        'https://event-management-system-organizer.onrender.com',
        'https://event-management-system-9gpt.onrender.com',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];