<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Singleton (id = 1) holding the drinks-calculator configuration.
        Schema::create('drink_plans', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('guest_count')->nullable(); // null => use confirmed headcount
            $table->unsignedInteger('duration_hours')->default(5);
            $table->string('event_type')->default('reception');
            $table->json('mix')->nullable(); // {beer, wine, spirits, non_alcoholic} percentages
            $table->boolean('include_toast')->default(true);
            $table->text('notes')->nullable();
            $table->text('ai_tip')->nullable();
            $table->timestamp('ai_tip_generated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('drink_plans');
    }
};
