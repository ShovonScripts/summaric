<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    public function definition(): array
    {
        return [
            'slug' => fake()->unique()->slug(3),
            'name' => fake()->words(2, true),
            'blurb' => fake()->sentence(),
            'motif' => fake()->randomElement(['orbit', 'grid', 'wave', 'steps', 'sun', 'ripple']),
        ];
    }

    public function configure(): static
    {
        return $this->afterMaking(function (Category $category) {
            //
        })->afterCreating(function (Category $category) {
            //
        });
    }
}