<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('date');
            $table->time('clock_in_time');
            $table->enum('status', ['hadir', 'hampir_terlambat', 'terlambat']);
            $table->decimal('lat_in', 10, 7);
            $table->decimal('long_in', 10, 7);
            $table->timestamps();

            $table->unique(['user_id', 'date']); // One attendance per user per day
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
