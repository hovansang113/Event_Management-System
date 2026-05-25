<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // First, add the virtual column
        DB::statement('ALTER TABLE registrations ADD active_registration_flag TINYINT(1) GENERATED ALWAYS AS (CASE WHEN status IN ("Confirmed", "Waitlist") THEN 1 ELSE NULL END) VIRTUAL');
        
        // Then, add the unique constraint
        Schema::table('registrations', function (Blueprint $table) {
            $table->unique(['user_id', 'event_id', 'active_registration_flag'], 'unique_active_registration');
        });
    }

    public function down(): void
    {
        Schema::table('registrations', function (Blueprint $table) {
            $table->dropUnique('unique_active_registration');
            $table->dropColumn('active_registration_flag');
        });
    }
};
