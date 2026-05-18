<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('registrations', function (Blueprint $table) {
            $table->id(); // BIGINT PRIMARY KEY AUTO_INCREMENT

            $table->foreignId('user_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            $table->foreignId('event_id')
                  ->constrained('events')
                  ->cascadeOnDelete();

            $table->enum('status', ['Confirmed', 'Waitlist', 'Cancelled'])
                  ->default('Confirmed');

            $table->integer('position_in_waitlist')->nullable();

            $table->timestamp('cancelled_at')->nullable();

            $table->timestamps(); // created_at + updated_at (auto ON UPDATE)

            // Unique constraint
            $table->unique(['user_id', 'event_id'], 'unique_registration');

            // Indexes
            $table->index('event_id', 'idx_event_id');
            $table->index('user_id', 'idx_user_id');
            $table->index('status', 'idx_status');
            $table->index('position_in_waitlist', 'idx_position_in_waitlist');
            // Composite index tối ưu cho withCount query
            $table->index(['event_id', 'status'], 'idx_event_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};