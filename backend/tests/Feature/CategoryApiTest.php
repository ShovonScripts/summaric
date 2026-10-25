<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class CategoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_categories(): void
    {
        Category::factory()->count(3)->create();

        $response = $this->getJson('/api/categories');

        // Non-paginated collection: a single "data" array at the root.
        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['slug', 'name', 'blurb', 'motif', 'books_count'],
                ],
            ]);

        $this->assertArrayNotHasKey('meta', $response->json());
    }

    public function test_can_show_category(): void
    {
        Category::factory()->create([
            'slug' => 'monon',
            'name' => 'মনন ও দর্শন',
        ]);

        $response = $this->getJson('/api/categories/monon');

        // Single resource: one object inside "data".
        $response->assertStatus(200)
            ->assertJsonPath('data.slug', 'monon')
            ->assertJsonPath('data.name', 'মনন ও দর্শন')
            ->assertJsonMissingPath('slug');

        $this->assertIsArray($response->json('data'));
    }

    public function test_returns_404_for_nonexistent_category(): void
    {
        $this->getJson('/api/categories/nonexistent')->assertStatus(404);
    }

    public function test_categories_have_books_count(): void
    {
        $category = Category::factory()->create(['slug' => 'counted']);
        $other = Category::factory()->create(['slug' => 'other']);

        Book::factory()->published()->count(3)->create(['category_id' => $category->id]);
        Book::factory()->draft()->create(['category_id' => $category->id]);
        Book::factory()->review()->create(['category_id' => $category->id]);
        Book::factory()->published()->create(['category_id' => $other->id]);

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200);

        $counts = collect($response->json('data'))->pluck('books_count', 'slug')->toArray();

        // Only published books are counted…
        $this->assertSame(3, $counts['counted']);
        $this->assertSame(1, $counts['other']);
        // …and the value is a JSON number, not a string.
        $this->assertIsInt($response->json('data.0.books_count'));
    }

    public function test_category_books_count_matches_published_books_only(): void
    {
        $category = Category::factory()->create(['slug' => 'monobiggan']);

        Book::factory()->published()->count(2)->create(['category_id' => $category->id]);
        Book::factory()->draft()->count(2)->create(['category_id' => $category->id]);

        $this->getJson('/api/categories/monobiggan')
            ->assertStatus(200)
            ->assertJsonPath('data.books_count', 2);
    }

    public function test_categories_are_loaded_without_n_plus_one_queries(): void
    {
        $categories = Category::factory()->count(6)->create();

        foreach ($categories as $category) {
            Book::factory()->published()->count(2)->create(['category_id' => $category->id]);
        }

        DB::flushQueryLog();
        DB::enableQueryLog();
        $this->getJson('/api/categories')->assertStatus(200);
        $queries = count(DB::getQueryLog());
        DB::disableQueryLog();

        // One query: the published-book count is a correlated subquery.
        $this->assertSame(1, $queries);
    }

    public function test_category_list_is_ordered_deterministically(): void
    {
        Category::factory()->create(['name' => 'খ', 'slug' => 'kha']);
        Category::factory()->create(['name' => 'ক', 'slug' => 'ka']);
        Category::factory()->create(['name' => 'গ', 'slug' => 'ga']);

        $slugs = collect($this->getJson('/api/categories')->json('data'))->pluck('slug')->toArray();

        $this->assertSame(['ka', 'kha', 'ga'], $slugs);
    }
}
