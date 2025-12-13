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
        Schema::create('upload_sessions', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('disk')->default('s3');
            $table->string('purpose');
            $table->string('directory');
            $table->string('filename');
            $table->string('content_type');
            $table->unsignedBigInteger('content_length');
            $table->unsignedInteger('part_size');
            $table->unsignedInteger('part_count');
            $table->string('upload_id');
            $table->string('storage_path');
            $table->string('status')->default('pending');
            $table->json('parts')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->string('attached_to_type')->nullable();
            $table->unsignedBigInteger('attached_to_id')->nullable();
            $table->text('error')->nullable();
            $table->timestamps();

            $table->index(['attached_to_type', 'attached_to_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('upload_sessions');
    }
};
