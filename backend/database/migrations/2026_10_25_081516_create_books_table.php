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
        Schema::create('books', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->string('author');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->unsignedSmallInteger('year')->nullable();
            $table->unsignedInteger('pages')->nullable();
            $table->unsignedSmallInteger('read_time')->nullable();
            $table->text('summary')->nullable();
            $table->json('key_ideas')->nullable();
            $table->text('quote')->nullable();
            $table->json('cover')->nullable();
            $table->date('added_at')->nullable();
            $table->boolean('featured')->default(false);
            $table->enum('status', ['published', 'draft', 'review'])->default('published');
            $table->json('tags')->nullable();
            $table->timestamps();

            $table->index(['status', 'added_at']);
            $table->index('category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('books');
    }
};
