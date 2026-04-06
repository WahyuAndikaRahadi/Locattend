<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Convert existing statuses to the new simplified ones
        DB::table('attendances')->where('status', 'terlambat')->update(['status' => 'hadir']);
        DB::table('attendances')->where('status', 'cuti')->update(['status' => 'izin']);

        Schema::table('attendances', function (Blueprint $table) {
            $table->enum('status', ['hadir', 'izin', 'alpha'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->enum('status', ['hadir', 'terlambat', 'izin', 'cuti', 'alpha'])->change();
        });
    }
};
