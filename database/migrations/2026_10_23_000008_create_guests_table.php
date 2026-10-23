<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('table_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('side')->default('other'); // GuestSide
            $table->string('group')->nullable(); // "Family", "Friends", "Work"
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->boolean('invited')->default(false);
            $table->string('rsvp_status')->default('pending'); // RsvpStatus
            $table->boolean('plus_one')->default(false);
            $table->string('plus_one_name')->nullable();
            $table->string('seat_note')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
