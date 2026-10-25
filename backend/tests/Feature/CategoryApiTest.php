<?php

namespace Tests\Feature;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_categories(): void
    {
        Category::factory()->count(3)->create();

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['slug', 'name', 'blurb', 'motif', 'books_count'],
            ]);
    }

    public function test_can_show_category(): void
    {
        $category = Category::factory()->create([
            'slug' => 'monon',
            'name' => 'মনন ও দর্শন',
        ]);

        $response = $this->getJson('/api/categories/monon');

        $response->assertStatus(200)
            ->assertJson([
                'slug' => 'monon',
                'name' => 'মনন ও দর্শন',
            ]);
    }

    public function test_returns_404_for_nonexistent_category(): void
    {
        $response = $this->getJson('/api/categories/nonexistent');

        $response->assertStatus(404);
    }

    public function test_categories_have_books_count(): void
    {
        $category = Category::factory()->create();

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                '*' => ['books_count'],
            ]);
    }
}