<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique(); 
            $table->string('password');

            $table->enum('role', ['organizer', 'attendee', 'admin'])
                ->default('attendee')
                ->index(); 

            $table->boolean('email_verified')->default(false)->index();
            $table->timestamp('email_verified_at')->nullable();

            $table->string('verification_token')->nullable()->unique();
            $table->timestamp('verification_token_expires_at')->nullable(); 

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};