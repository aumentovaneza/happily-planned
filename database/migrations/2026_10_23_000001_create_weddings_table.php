<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('weddings', function (Blueprint $table) {
            $table->id();
            $table->string('partner_one_name')->nullable();
            $table->string('partner_two_name')->nullable();
            $table->date('wedding_date')->nullable();
            $table->unsignedBigInteger('budget_ceiling')->nullable(); // centavos
            $table->string('currency', 3)->default('PHP');
            // Cached Budget Advisor output (AI runs on demand, not every page load).
            $table->text('advisor_summary')->nullable();
            $table->timestamp('advisor_generated_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('weddings');
    }
};
