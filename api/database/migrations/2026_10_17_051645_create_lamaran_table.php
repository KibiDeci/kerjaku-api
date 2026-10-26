<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lamaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lowongan_id')->constrained('lowongan')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('cv');
            $table->text('pesan')->nullable();
            $table->timestamps();

            $table->unique(['lowongan_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lamaran');
    }
};
