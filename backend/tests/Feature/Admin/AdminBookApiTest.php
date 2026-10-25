<?php

namespace Tests\Feature\Admin;

use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Database\Seeders\CategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminBookApiTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private Category $category;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CategorySeeder::class);
        $this->admin = User::factory()->admin()->create();
        $this->category = Category::where('slug', 'monon')->firstOrFail();
    }

    private function payload(array $overrides = []): array
    {
        return array_merge([
            'slug' => 'admin-created-book',
            'title' => 'অ্যাডমিনের বই',
            'author' => 'সম্পাদক',
            'category_id' => $this->category->id,
            'year' => 2026,
            'pages' => 220,
            'read_time' => 8,
            'summary' => 'সংক্ষিপ্ত বিবরণ।',
            'key_ideas' => ['প্রথম ভাবনা', 'দ্বিতীয় ভাবনা'],
            'quote' => 'একটি উদ্ধৃতি।',
            'cover' => [
                'base' => '#15343b',
                'accent' => '#f5bc5c',
                'ink' => '#f6f1e6',
                'motif' => 'ripple',
            ],
            'added_at' => '2026-10-01',
            'featured' => false,
            'status' => 'draft',
            'tags' => ['পরীক্ষা'],
        ], $overrides);
    }

    public function test_list_includes_every_status(): void
    {
        Book::factory()->published()->create(['slug' => 'published-book']);
        Book::factory()->draft()->create(['slug' => 'draft-book']);

        $response = $this->actingAs($this->admin)->getJson('/api/admin/books');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'slug', 'title', 'status', 'category'],
                ],
                'meta' => ['current_page', 'last_page', 'per_page', 'total'],
            ]);

        $slugs = collect($response->json('data'))->pluck('slug');
        $this->assertContains('published-book', $slugs);
        $this->assertContains('draft-book', $slugs);
    }

    public function test_can_filter_by_status_and_search(): void
    {
        Book::factory()->published()->create(['slug' => 'find-me', 'title' => 'খোঁজার বই']);
        Book::factory()->draft()->create(['slug' => 'draft-only']);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/books?status=draft&search=খোঁজার');

        $response->assertStatus(200)->assertJsonCount(0, 'data');

        $this->actingAs($this->admin)
            ->getJson('/api/admin/books?search=খোঁজার')
            ->assertStatus(200)
            ->assertJsonPath('data.0.slug', 'find-me');
    }

    public function test_can_create_a_book(): void
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/admin/books', $this->payload());

        $response->assertStatus(201)
            ->assertJsonPath('data.slug', 'admin-created-book')
            ->assertJsonPath('data.status', 'draft');

        $this->assertDatabaseHas('books', [
            'slug' => 'admin-created-book',
            'status' => 'draft',
        ]);
    }

    public function test_create_validates_required_fields_and_duplicates(): void
    {
        $this->actingAs($this->admin)
            ->postJson('/api/admin/books', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['slug', 'title', 'author', 'category_id', 'status']);

        Book::factory()->create(['slug' => 'taken-slug']);

        $this->actingAs($this->admin)
            ->postJson('/api/admin/books', $this->payload(['slug' => 'taken-slug']))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_can_update_a_book_and_keep_its_slug(): void
    {
        $book = Book::factory()->create(['slug' => 'editable-book', 'status' => 'draft']);

        $this->actingAs($this->admin)
            ->putJson("/api/admin/books/{$book->id}", $this->payload([
                'slug' => 'editable-book',
                'title' => 'নতুন শিরোনাম',
                'status' => 'published',
            ]))
            ->assertStatus(200)
            ->assertJsonPath('data.title', 'নতুন শিরোনাম')
            ->assertJsonPath('data.status', 'published');

        $this->assertDatabaseHas('books', [
            'id' => $book->id,
            'slug' => 'editable-book',
            'status' => 'published',
        ]);
    }

    public function test_can_delete_a_book(): void
    {
        $book = Book::factory()->create(['slug' => 'delete-me']);

        $this->actingAs($this->admin)
            ->deleteJson("/api/admin/books/{$book->id}")
            ->assertStatus(200);

        $this->assertDatabaseMissing('books', ['id' => $book->id]);
    }

    public function test_non_admin_cannot_write(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->postJson('/api/admin/books', $this->payload())
            ->assertStatus(403);
    }
}
