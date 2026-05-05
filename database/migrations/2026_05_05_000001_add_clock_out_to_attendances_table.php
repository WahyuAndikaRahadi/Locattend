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
        Schema::table('attendances', function (Blueprint $table) {
            // Add clock out fields
            $table->time('clock_out_time')->nullable()->after('clock_in_time');
            $table->integer('duration_minutes')->nullable()->after('clock_out_time'); // Durasi kerja dalam menit
            $table->text('work_report')->nullable()->after('duration_minutes'); // Laporan pekerjaan harian

            // Add late detection fields
            $table->boolean('is_late')->default(false)->after('work_report'); // Flag keterlambatan
            $table->integer('late_minutes')->default(0)->after('is_late'); // Berapa menit terlambat
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn(['clock_out_time', 'duration_minutes', 'work_report', 'is_late', 'late_minutes']);
        });
    }
};
