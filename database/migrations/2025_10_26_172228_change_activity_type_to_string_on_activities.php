<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->string('activity_type', 30)->change();
        });
    }

    public function down(): void
    {
        Schema::table('activities', function (Blueprint $table) {
            $table->enum('activity_type', ['sadnja', 'zalivanje', 'djubrenje', 'obrezivanje', 'berba', 'presadjivanje', 'drugo'])->change();
        });
    }
};

