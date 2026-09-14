<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        DB::statement("ALTER TABLE activities MODIFY activity_type VARCHAR(30) NOT NULL");
    }

    public function down(): void
    {
        // Ako baš želiš nazad u ENUM:
        DB::statement("ALTER TABLE activities MODIFY activity_type ENUM(
            'sadnja','zalivanje','presadjivanje','djubrenje','obrezivanje','berba','drugo'
        ) NOT NULL");
    }
};
