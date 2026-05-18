<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();

            $table->foreignId('organizer_id')
                  ->constrained('users')
                  ->cascadeOnDelete();

            $table->foreignId('category_id')
                  ->constrained('categories');

            $table->string('title');
            $table->longText('description');

            $table->string('image')->nullable();

            $table->string('location');

            $table->date('event_date');
            $table->time('event_time');

            $table->integer('capacity');

            $table->enum('status', ['Draft', 'Pending', 'Published', 'Rejected', 'Cancelled'])
                  ->default('Draft');

            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancellation_reason')->nullable();

            $table->timestamps(); 

            $table->index('status');
            $table->index('event_date');
            $table->index('organizer_id');
            $table->index('category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
