<?php

namespace Database\Factories;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class BookFactory extends Factory
{
    protected $model = Book::class;

    public function definition(): array
    {
        $covers = [
            ['base' => '#15343b', 'accent' => '#f5bc5c', 'ink' => '#f6f1e6', 'motif' => 'ripple'],
            ['base' => '#2b2418', 'accent' => '#3cc492', 'ink' => '#f5eddc', 'motif' => 'wave'],
            ['base' => '#24203a', 'accent' => '#f5bc5c', 'ink' => '#f4efff', 'motif' => 'orbit'],
            ['base' => '#0f2c33', 'accent' => '#3cc492', 'ink' => '#eaf7f4', 'motif' => 'grid'],
            ['base' => '#3a2028', 'accent' => '#f5bc5c', 'ink' => '#fff0e8', 'motif' => 'sun'],
            ['base' => '#1b2c25', 'accent' => '#f5bc5c', 'ink' => '#edf5ee', 'motif' => 'steps'],
            ['base' => '#1d2738', 'accent' => '#f5bc5c', 'ink' => '#f0f4ff', 'motif' => 'moon'],
            ['base' => '#33261b', 'accent' => '#3cc492', 'ink' => '#fbf1df', 'motif' => 'stack'],
            ['base' => '#23313a', 'accent' => '#f5bc5c', 'ink' => '#edf7fb', 'motif' => 'orbit'],
            ['base' => '#112b2a', 'accent' => '#f5bc5c', 'ink' => '#eaf8f1', 'motif' => 'spiral'],
            ['base' => '#2a2030', 'accent' => '#3cc492', 'ink' => '#f7efff', 'motif' => 'arch'],
            ['base' => '#1d2a2a', 'accent' => '#f5bc5c', 'ink' => '#f0f5ef', 'motif' => 'stack'],
            ['base' => '#2f2028', 'accent' => '#3cc492', 'ink' => '#fbeef3', 'motif' => 'moon'],
            ['base' => '#202b32', 'accent' => '#f5bc5c', 'ink' => '#f0f6fa', 'motif' => 'wave'],
        ];

        $cover = fake()->randomElement($covers);

        return [
            'slug' => fake()->unique()->slug(4),
            'title' => fake()->sentence(3),
            'author' => fake()->name(),
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(),
            'year' => fake()->numberBetween(2020, 2026),
            'pages' => fake()->numberBetween(180, 350),
            'read_time' => fake()->numberBetween(6, 15),
            'summary' => fake()->paragraphs(3, true),
            'key_ideas' => [
                fake()->sentence(),
                fake()->sentence(),
                fake()->sentence(),
            ],
            'quote' => fake()->sentence(),
            'cover' => $cover,
            'added_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'featured' => false,
            'status' => 'published',
            'tags' => fake()->words(3),
        ];
    }

    public function published(): static
    {
        return $this->state(fn() => ['status' => 'published']);
    }

    public function draft(): static
    {
        return $this->state(fn() => ['status' => 'draft']);
    }

    public function review(): static
    {
        return $this->state(fn() => ['status' => 'review']);
    }

    public function featured(): static
    {
        return $this->state(fn() => ['featured' => true]);
    }
}