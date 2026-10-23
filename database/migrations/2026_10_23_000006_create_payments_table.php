<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('budget_item_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('amount'); // centavos
            $table->date('paid_on');
            $table->string('method')->nullable(); // GCash, Cash, Bank...
            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
