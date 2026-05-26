<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

beforeEach(function () {
    $this->admin = User::create([
        'name' => 'Admin User',
        'email' => 'admin@example.com',
        'password' => bcrypt('password'),
        'role' => 'admin',
        'email_verified' => true
    ]);

    $this->token = JWTAuth::fromUser($this->admin);
    $this->headers = ['Authorization' => "Bearer {$this->token}"];
});

test('admin can create a category', function () {
    $response = $this->postJson('/api/admin/categories', [
        'name' => 'Music',
        'description' => 'Music events and concerts',
        'icon' => 'music-icon'
    ], $this->headers);

    $response->assertStatus(201)
        ->assertJsonPath('data.name', 'Music')
        ->assertJsonPath('data.slug', 'music');

    $this->assertDatabaseHas('categories', ['name' => 'Music']);
});

test('admin can list categories including trashed', function () {
    Category::create(['name' => 'Tech', 'description' => 'Tech events']);
    $deleted = Category::create(['name' => 'Sport', 'description' => 'Sport events']);
    $deleted->delete();

    $response = $this->getJson('/api/admin/categories', $this->headers);

    $response->assertStatus(200)
        ->assertJsonCount(2, 'data');
});

test('admin can update a category', function () {
    $category = Category::create(['name' => 'Old Name', 'description' => 'Old Desc']);

    $response = $this->putJson("/api/admin/categories/{$category->id}", [
        'name' => 'New Name',
        'description' => 'New Desc'
    ], $this->headers);

    $response->assertStatus(200)
        ->assertJsonPath('data.name', 'New Name')
        ->assertJsonPath('data.slug', 'new-name');

    $this->assertDatabaseHas('categories', ['name' => 'New Name']);
});

test('admin can soft delete a category', function () {
    $category = Category::create(['name' => 'To Delete']);

    $response = $this->deleteJson("/api/admin/categories/{$category->id}", [], $this->headers);

    $response->assertStatus(200);
    $this->assertSoftDeleted('categories', ['id' => $category->id]);
});

test('admin can restore a soft-deleted category', function () {
    $category = Category::create(['name' => 'To Restore']);
    $category->delete();

    $response = $this->postJson("/api/admin/categories/{$category->id}/restore", [], $this->headers);

    $response->assertStatus(200);
    $this->assertDatabaseHas('categories', ['id' => $category->id, 'deleted_at' => null]);
});

test('admin can deactivate and activate a category', function () {
    $category = Category::create(['name' => 'Status Test', 'is_active' => true]);

    // Deactivate
    $response = $this->patchJson("/api/admin/categories/{$category->id}/deactivate", [], $this->headers);
    $response->assertStatus(200)->assertJsonPath('data.is_active', false);
    
    // Activate
    $response = $this->patchJson("/api/admin/categories/{$category->id}/activate", [], $this->headers);
    $response->assertStatus(200)->assertJsonPath('data.is_active', true);
});

test('slug is automatically updated when name changes', function () {
    $category = Category::create(['name' => 'Original Name']);
    expect($category->slug)->toBe('original-name');

    $this->putJson("/api/admin/categories/{$category->id}", [
        'name' => 'Updated Name'
    ], $this->headers);

    $category->refresh();
    expect($category->name)->toBe('Updated Name');
    expect($category->slug)->toBe('updated-name');
});
