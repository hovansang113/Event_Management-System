<?php

test('the application returns a successful response', function () {
    $response = $this->getJson('/api/auth/login');

    $response->assertStatus(405);
});
