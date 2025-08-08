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
        Schema::create('plants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            $table->string('variety');
            $table->string('location')->nullable();
            $table->date('planted_at')->nullable();

            $table->date('last_watered_at')->nullable();
            $table->date('next_watering_at')->nullable();
            $table->date('last_fertilized_at')->nullable();
            $table->date('next_fertilizing_at')->nullable();
            $table->unsignedInteger('watering_count')->default(0);
            $table->unsignedInteger('fertilizing_count')->default(0);

            $table->enum('health_status', [
                'dobro stanje',
                'kritično stanje',
                'biljka je uvenula',
            ])->default('dobro stanje');
            $table->string('notes', 500)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plants');
    }
};
