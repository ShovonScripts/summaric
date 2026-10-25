<?php

namespace Tests\Feature\Admin;

use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCategoryApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CategorySeeder::class);
        $this->admin = User::factory()->admin()->create();
    }

    public function test_lists_categories_with_total_book_counts(): void
    {
        $category = Category::where('slug', 'monon')->firstOrFail();
        Book::factory()->published()->create(['category_id' => $category->id]);
        Book::factory()->draft()->create(['category_id' => $category->id]);

        $response = $this->actingAs($this->admin)->getJson('/api/admin/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'slug', 'name', 'blurb', 'motif', 'books_count'],
                ],
            ]);

        $monon = collect($response->json('data'))->firstWhere('slug', 'monon');
        $this->assertSame(2, $monon['books_count']);
    }

    public function test_can_create_a_category(): void
    {
        $this->actingAs($this->admin)
            ->postJson('/api/admin/categories', [
                'slug' => 'new-topic',
                'name' => 'নতুন বিষয়',
                'blurb' => 'নতুন বিষয়ের বিবরণ।',
                'motif' => 'sun',
            ])
            ->assertStatus(201)
            ->assertJsonPath('data.slug', 'new-topic')
            ->assertJsonPath('data.books_count', 0);

        $this->assertDatabaseHas('categories', ['slug' => 'new-topic']);
    }

    public function test_create_rejects_duplicate_slug(): void
    {
        $this->actingAs($this->admin)
            ->postJson('/api/admin/categories', [
                'slug' => 'monon',
                'name' => 'নকল',
                'blurb' => 'নকল বিবরণ।',
                'motif' => 'sun',
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_can_update_a_category(): void
    {
        $this->actingAs($this->admin)
            ->putJson('/api/admin/categories/monon', [
                'slug' => 'monon',
                'name' => 'মনন ও দর্শন (নতুন)',
                'blurb' => 'হালনাগাদ বিবরণ।',
                'motif' => 'steps',
            ])
            ->assertStatus(200)
            ->assertJsonPath('data.name', 'মনন ও দর্শন (নতুন)');

        $this->assertDatabaseHas('categories', [
            'slug' => 'monon',
            'motif' => 'steps',
        ]);
    }

    public function test_cannot_delete_a_category_with_books(): void
    {
        $category = Category::where('slug', 'monon')->firstOrFail();
        Book::factory()->create(['category_id' => $category->id]);

        $this->actingAs($this->admin)
            ->deleteJson('/api/admin/categories/monon')
            ->assertStatus(422);

        $this->assertDatabaseHas('categories', ['id' => $category->id]);
    }

    public function test_can_delete_an_empty_category(): void
    {
        $category = Category::create([
            'slug' => 'empty-topic',
            'name' => 'খালি বিষয়',
            'blurb' => 'বই নেই।',
            'motif' => 'moon',
        ]);

        $this->actingAs($this->admin)
            ->deleteJson("/api/admin/categories/{$category->slug}")
            ->assertStatus(200);

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
