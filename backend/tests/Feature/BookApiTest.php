<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Category;
use Database\Seeders\CategorySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class BookApiTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Fields every serialized book must expose.
     */
    private const BOOK_FIELDS = [
        'slug',
        'title',
        'author',
        'category',
        'year',
        'pages',
        'read_time',
        'summary',
        'key_ideas',
        'quote',
        'cover',
        'added_at',
        'featured',
        'status',
        'tags',
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(CategorySeeder::class);
    }

    private function slugs($response): array
    {
        return collect($response->json('data'))->pluck('slug')->toArray();
    }

    public function test_can_list_published_books(): void
    {
        Book::factory()->published()->count(2)->create();

        $response = $this->getJson('/api/books');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => self::BOOK_FIELDS,
                ],
                'meta' => ['current_page', 'per_page', 'last_page', 'total', 'from', 'to'],
                'links' => ['first', 'last', 'prev', 'next'],
            ]);
    }

    public function test_listing_is_wrapped_in_a_data_array_only(): void
    {
        Book::factory()->published()->create();

        $response = $this->getJson('/api/books');

        // Paginated collections: data + meta + links at the root, never nested twice.
        $response->assertStatus(200)
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.total', 1);

        $this->assertIsArray($response->json('data'));
        $this->assertArrayHasKey('slug', $response->json('data.0'));
        $this->assertNull($response->json('data.data'));
    }

    public function test_excludes_draft_books_from_public_listing(): void
    {
        Book::factory()->published()->create(['slug' => 'published-book']);
        Book::factory()->draft()->create(['slug' => 'draft-book']);

        $response = $this->getJson('/api/books');

        $response->assertStatus(200);
        $this->assertContains('published-book', $this->slugs($response));
        $this->assertNotContains('draft-book', $this->slugs($response));
    }

    public function test_excludes_review_books_from_public_listing(): void
    {
        Book::factory()->published()->create(['slug' => 'published-book']);
        Book::factory()->review()->create(['slug' => 'review-book']);

        $response = $this->getJson('/api/books');

        $response->assertStatus(200);
        $this->assertContains('published-book', $this->slugs($response));
        $this->assertNotContains('review-book', $this->slugs($response));
    }

    public function test_can_show_published_book_by_slug(): void
    {
        Book::factory()->published()->create(['slug' => 'my-book-slug']);

        $response = $this->getJson('/api/books/my-book-slug');

        // Single resource: one object inside "data".
        $response->assertStatus(200)
            ->assertJsonPath('data.slug', 'my-book-slug')
            ->assertJsonMissingPath('slug');

        $this->assertIsArray($response->json('data'));
    }

    public function test_book_detail_includes_category(): void
    {
        $category = Category::where('slug', 'monon')->firstOrFail();
        Book::factory()->published()->create([
            'category_id' => $category->id,
            'slug' => 'test-book',
        ]);

        $response = $this->getJson('/api/books/test-book');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'category' => ['slug', 'name', 'blurb', 'motif'],
                ],
            ])
            ->assertJsonPath('data.category.slug', 'monon');
    }

    public function test_book_detail_eager_loads_category(): void
    {
        $category = Category::where('slug', 'monon')->firstOrFail();
        Book::factory()->published()->create([
            'category_id' => $category->id,
            'slug' => 'eager-book',
        ]);

        DB::flushQueryLog();
        DB::enableQueryLog();
        $this->getJson('/api/books/eager-book')->assertStatus(200);
        $queries = count(DB::getQueryLog());
        DB::disableQueryLog();

        // One query for the book, one for its category — never a lazy load
        // spread across the response serialization.
        $this->assertLessThanOrEqual(2, $queries);
    }

    public function test_returns_404_for_draft_book(): void
    {
        Book::factory()->draft()->create(['slug' => 'draft-book']);

        $this->getJson('/api/books/draft-book')->assertStatus(404);
    }

    public function test_returns_404_for_review_book(): void
    {
        Book::factory()->review()->create(['slug' => 'review-book']);

        $this->getJson('/api/books/review-book')->assertStatus(404);
    }

    public function test_returns_404_for_nonexistent_book(): void
    {
        $this->getJson('/api/books/nonexistent')->assertStatus(404);
    }

    public function test_can_filter_by_category(): void
    {
        $category = Category::where('slug', 'monon')->firstOrFail();
        Book::factory()->published()->create(['category_id' => $category->id, 'slug' => 'monon-book']);
        Book::factory()->published()->create(['slug' => 'other-book']);

        $response = $this->getJson('/api/books?category=monon');

        $response->assertStatus(200);
        $this->assertContains('monon-book', $this->slugs($response));
        $this->assertNotContains('other-book', $this->slugs($response));
    }

    public function test_can_search_books(): void
    {
        Book::factory()->published()->create(['title' => 'নিঃশব্দের ভাষা', 'slug' => 'nishobder-bhasha']);
        Book::factory()->published()->create(['title' => 'অন্য বই', 'slug' => 'other-book']);

        $response = $this->getJson('/api/books?search=নিঃশব্দ');

        $response->assertStatus(200);
        $this->assertContains('nishobder-bhasha', $this->slugs($response));
        $this->assertNotContains('other-book', $this->slugs($response));
    }

    public function test_can_sort_books_by_title(): void
    {
        Book::factory()->published()->create(['title' => 'বই খ', 'slug' => 'book-b', 'added_at' => '2026-02-01']);
        Book::factory()->published()->create(['title' => 'বই গ', 'slug' => 'book-a', 'added_at' => '2026-03-01']);
        Book::factory()->published()->create(['title' => 'বই ক', 'slug' => 'book-c', 'added_at' => '2026-01-01']);

        $response = $this->getJson('/api/books?sort=title');

        $response->assertStatus(200);
        $this->assertEquals(
            ['বই ক', 'বই খ', 'বই গ'],
            collect($response->json('data'))->pluck('title')->toArray(),
        );
    }

    public function test_sorts_by_read_time_with_a_stable_secondary_order(): void
    {
        // Explicit fixtures: every read_time is chosen in the test instead of
        // relying on factory randomness or incidental record ids.
        Book::factory()->published()->create(['slug' => 'seven', 'read_time' => 7]);
        Book::factory()->published()->create(['slug' => 'five', 'read_time' => 5]);
        Book::factory()->published()->create(['slug' => 'nine', 'read_time' => 9]);
        Book::factory()->published()->create(['slug' => 'six-first', 'read_time' => 6]);
        Book::factory()->published()->create(['slug' => 'six-second', 'read_time' => 6]);

        $response = $this->getJson('/api/books?sort=read_time');

        $response->assertStatus(200);

        // read_time ascending; equal read_time values fall back to `id` ascending.
        $this->assertEquals(
            ['five', 'six-first', 'six-second', 'seven', 'nine'],
            $this->slugs($response),
        );
        $this->assertEquals(
            [5, 6, 6, 7, 9],
            collect($response->json('data'))->pluck('read_time')->toArray(),
        );
    }

    public function test_newest_sort_is_deterministic(): void
    {
        Book::factory()->published()->create(['slug' => 'older', 'added_at' => '2026-01-01']);
        Book::factory()->published()->create(['slug' => 'newer', 'added_at' => '2026-03-01']);
        Book::factory()->published()->create(['slug' => 'tie-first', 'added_at' => '2026-02-01']);
        Book::factory()->published()->create(['slug' => 'tie-second', 'added_at' => '2026-02-01']);

        $response = $this->getJson('/api/books');

        // added_at descending, ties broken by id descending.
        $this->assertEquals(
            ['newer', 'tie-second', 'tie-first', 'older'],
            $this->slugs($response),
        );
    }

    public function test_invalid_sort_parameter_defaults_to_newest(): void
    {
        Book::factory()->published()->create(['slug' => 'book-1', 'added_at' => '2026-01-01']);
        Book::factory()->published()->create(['slug' => 'book-2', 'added_at' => '2026-02-01']);

        $response = $this->getJson('/api/books?sort=invalid');

        $response->assertStatus(200);
        $this->assertEquals(['book-2', 'book-1'], $this->slugs($response));
    }

    public function test_pagination_works(): void
    {
        Book::factory()->published()->count(25)->create();

        $response = $this->getJson('/api/books?per_page=10');

        $response->assertStatus(200)
            ->assertJsonPath('meta.current_page', 1)
            ->assertJsonPath('meta.per_page', 10)
            ->assertJsonPath('meta.total', 25)
            ->assertJsonPath('meta.from', 1)
            ->assertJsonPath('meta.to', 10);

        $this->assertCount(10, $response->json('data'));
        $this->assertSame(3, $response->json('meta.last_page'));
    }

    public function test_pagination_last_page_is_an_integer(): void
    {
        Book::factory()->published()->count(25)->create();

        $lastPage = $this->getJson('/api/books?per_page=10')->json('meta.last_page');

        $this->assertIsInt($lastPage);
        $this->assertSame(3, $lastPage);
    }

    public function test_pagination_second_page_carries_paging_links(): void
    {
        Book::factory()->published()->count(25)->create();

        $response = $this->getJson('/api/books?per_page=10&page=2');

        $response->assertStatus(200)
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.from', 11)
            ->assertJsonPath('meta.to', 20);

        $this->assertNotNull($response->json('links.prev'));
        $this->assertNotNull($response->json('links.next'));
        $this->assertNotNull($response->json('links.first'));
        $this->assertNotNull($response->json('links.last'));
    }

    public function test_per_page_is_capped_at_fifty(): void
    {
        $response = $this->getJson('/api/books?per_page=500');

        $response->assertStatus(200)
            ->assertJsonPath('meta.per_page', 50);
    }

    public function test_per_page_below_one_falls_back_to_one(): void
    {
        Book::factory()->published()->count(2)->create();

        $response = $this->getJson('/api/books?per_page=0');

        $response->assertStatus(200)
            ->assertJsonPath('meta.per_page', 1);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_book_listing_eager_loads_category(): void
    {
        Book::factory()->published()->count(8)->create();

        DB::flushQueryLog();
        DB::enableQueryLog();
        $this->getJson('/api/books')->assertStatus(200);
        $queries = count(DB::getQueryLog());
        DB::disableQueryLog();

        // count + books + categories; a lazy load would add one query per book.
        $this->assertLessThanOrEqual(3, $queries);
    }

    public function test_featured_books_endpoint(): void
    {
        Book::factory()->published()->featured()->create(['slug' => 'featured-book']);
        Book::factory()->published()->create(['slug' => 'regular-book']);

        $response = $this->getJson('/api/books/featured');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => self::BOOK_FIELDS,
                ],
            ]);

        $this->assertContains('featured-book', $this->slugs($response));
        $this->assertNotContains('regular-book', $this->slugs($response));
        // Non-paginated collection: no pagination envelope.
        $this->assertNull($response->json('meta'));
    }

    public function test_featured_books_are_limited_to_five_published_books(): void
    {
        Book::factory()->published()->featured()->count(7)->create();
        Book::factory()->draft()->featured()->count(2)->create();
        Book::factory()->review()->featured()->count(2)->create();

        $response = $this->getJson('/api/books/featured');

        $response->assertStatus(200);
        $this->assertCount(5, $response->json('data'));
        $this->assertEquals(
            ['published'],
            collect($response->json('data'))->pluck('status')->unique()->values()->toArray(),
        );
    }

    public function test_invalid_category_filter_returns_empty(): void
    {
        $response = $this->getJson('/api/books?category=nonexistent');

        $response->assertStatus(200);
        $this->assertCount(0, $response->json('data'));
    }
}
