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
            $table->enum('status', ['hadir', 'terlambat', 'izin', 'cuti', 'alpha'])->change();
            $table->time('clock_in_time')->nullable()->change();
            $table->decimal('lat_in', 10, 7)->nullable()->change();
            $table->decimal('long_in', 10, 7)->nullable()->change();
        });

        Schema::table('leaves', function (Blueprint $table) {
            $table->enum('leave_type', ['izin', 'cuti'])->default('izin')->after('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->enum('status', ['hadir', 'hampir_terlambat', 'terlambat'])->change();
            $table->time('clock_in_time')->nullable(false)->change();
            $table->decimal('lat_in', 10, 7)->nullable(false)->change();
            $table->decimal('long_in', 10, 7)->nullable(false)->change();
        });

        Schema::table('leaves', function (Blueprint $table) {
            $table->dropColumn('leave_type');
        });
    }
};
