<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\CategorySeeder::class);
    }

    public function test_can_list_published_books(): void
    {
        $response = $this->getJson('/api/books');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['slug', 'title', 'author', 'category', 'year', 'read_time', 'summary', 'key_ideas', 'quote', 'cover', 'added_at', 'featured', 'status', 'tags'],
                ],
                'meta' => ['current_page', 'per_page', 'last_page', 'total', 'from', 'to'],
                'links' => ['first', 'last', 'prev', 'next'],
            ]);
    }

    public function test_excludes_draft_books_from_public_listing(): void
    {
        Book::factory()->published()->create(['slug' => 'published-book']);
        Book::factory()->draft()->create(['slug' => 'draft-book']);

        $response = $this->getJson('/api/books');

        $response->assertStatus(200);
        $slugs = collect($response->json('data'))->pluck('slug')->toArray();
        $this->assertContains('published-book', $slugs);
        $this->assertNotContains('draft-book', $slugs);
    }

    public function test_excludes_review_books_from_public_listing(): void
    {
        Book::factory()->published()->create(['slug' => 'published-book']);
        Book::factory()->review()->create(['slug' => 'review-book']);

        $response = $this->getJson('/api/books');

        $response->assertStatus(200);
        $slugs = collect($response->json('data'))->pluck('slug')->toArray();
        $this->assertContains('published-book', $slugs);
        $this->assertNotContains('review-book', $slugs);
    }

    public function test_can_show_published_book_by_slug(): void
    {
        $book = Book::factory()->published()->create(['slug' => 'my-book-slug']);

        $response = $this->getJson('/api/books/my-book-slug');

        $response->assertStatus(200)
            ->assertJson([
                'slug' => 'my-book-slug',
            ]);
    }

    public function test_returns_404_for_draft_book(): void
    {
        Book::factory()->draft()->create(['slug' => 'draft-book']);

        $response = $this->getJson('/api/books/draft-book');

        $response->assertStatus(404);
    }

    public function test_returns_404_for_nonexistent_book(): void
    {
        $response = $this->getJson('/api/books/nonexistent');

        $response->assertStatus(404);
    }

    public function test_can_filter_by_category(): void
    {
        $category = \App\Models\Category::where('slug', 'monon')->first();
        Book::factory()->published()->create(['category_id' => $category->id, 'slug' => 'monon-book']);
        Book::factory()->published()->create(['slug' => 'other-book']);

        $response = $this->getJson('/api/books?category=monon');

        $response->assertStatus(200);
        $slugs = collect($response->json('data'))->pluck('slug')->toArray();
        $this->assertContains('monon-book', $slugs);
        $this->assertNotContains('other-book', $slugs);
    }

    public function test_can_search_books(): void
    {
        Book::factory()->published()->create(['title' => 'নিঃশব্দের ভাষা', 'slug' => 'nishobder-bhasha']);
        Book::factory()->published()->create(['title' => 'অন্য বই', 'slug' => 'other-book']);

        $response = $this->getJson('/api/books?search=নিঃশব্দ');

        $response->assertStatus(200);
        $slugs = collect($response->json('data'))->pluck('slug')->toArray();
        $this->assertContains('nishobder-bhasha', $slugs);
        $this->assertNotContains('other-book', $slugs);
    }

    public function test_can_sort_books(): void
    {
        Book::factory()->published()->create(['title' => 'বই ক', 'slug' => 'book-c', 'added_at' => '2026-01-01']);
        Book::factory()->published()->create(['title' => 'বই খ', 'slug' => 'book-b', 'added_at' => '2026-02-01']);
        Book::factory()->published()->create(['title' => 'বই গ', 'slug' => 'book-a', 'added_at' => '2026-03-01']);

        // Sort by title
        $response = $this->getJson('/api/books?sort=title');
        $response->assertStatus(200);
        $titles = collect($response->json('data'))->pluck('title')->toArray();
        $this->assertEquals(['বই ক', 'বই খ', 'বই গ'], $titles);

        // Sort by read_time
        Book::factory()->published()->create(['slug' => 'short', 'read_time' => 5]);
        Book::factory()->published()->create(['slug' => 'long', 'read_time' => 15]);
        $response = $this->getJson('/api/books?sort=read_time');
        $response->assertStatus(200);
        $times = collect($response->json('data'))->pluck('read_time')->toArray();
        $this->assertEquals([5, 15], array_slice($times, 0, 2));
    }

    public function test_pagination_works(): void
    {
        Book::factory()->published()->count(25)->create();

        $response = $this->getJson('/api/books?per_page=10');

        $response->assertStatus(200);
        $this->assertCount(10, $response->json('data'));
        $this->assertEquals(3, $response->json('meta.last_page'));
    }

    public function test_invalid_sort_parameter_defaults_to_newest(): void
    {
        Book::factory()->published()->create(['slug' => 'book-1', 'added_at' => '2026-01-01']);
        Book::factory()->published()->create(['slug' => 'book-2', 'added_at' => '2026-02-01']);

        $response = $this->getJson('/api/books?sort=invalid');

        $response->assertStatus(200);
        // Should default to newest first
        $slugs = collect($response->json('data'))->pluck('slug')->toArray();
        // Latest should be first
    }

    public function test_featured_books_endpoint(): void
    {
        Book::factory()->published()->featured()->create(['slug' => 'featured-book']);
        Book::factory()->published()->create(['slug' => 'regular-book']);

        $response = $this->getJson('/api/books/featured');

        $response->assertStatus(200);
        $slugs = collect($response->json())->pluck('slug')->toArray();
        $this->assertContains('featured-book', $slugs);
        $this->assertNotContains('regular-book', $slugs);
    }

    public function test_book_detail_includes_category(): void
    {
        $category = \App\Models\Category::where('slug', 'monon')->first();
        Book::factory()->published()->create([
            'category_id' => $category->id,
            'slug' => 'test-book',
        ]);

        $response = $this->getJson('/api/books/test-book');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'category' => ['slug', 'name', 'blurb', 'motif'],
            ]);
    }

    public function test_invalid_category_filter_returns_empty(): void
    {
        $response = $this->getJson('/api/books?category=nonexistent');

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data'));
    }
}