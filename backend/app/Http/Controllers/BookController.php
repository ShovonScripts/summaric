<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookCollection;
use App\Http\Resources\BookResource;
use App\Http\Resources\FeaturedBookCollection;
use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Paginated listing of published books.
     *
     * Envelope: `{"data": [...], "meta": {...}, "links": {...}}`.
     */
    public function index(Request $request)
    {
        $query = Book::query()
            ->published()
            ->with('category');

        // Search
        if ($request->filled('search')) {
            $query->search($request->string('search')->toString());
        }

        // Category filter
        if ($request->filled('category')) {
            $query->byCategory($request->string('category')->toString());
        }

        // Sorting (always deterministic — see Book::scopeSort())
        $query->sort($request->string('sort')->toString());

        // Pagination: documented range is 1..50, default 12.
        $perPage = max(1, min($request->integer('per_page', 12), 50));
        $books = $query->paginate($perPage)->withQueryString();

        return new BookCollection($books);
    }

    /**
     * A single published book with its category.
     *
     * Envelope: `{"data": {...}}`. Draft and review books are not published,
     * so they resolve to 404 exactly like an unknown slug.
     */
    public function show(string $slug)
    {
        $book = Book::query()
            ->published()
            ->with('category')
            ->where('slug', $slug)
            ->firstOrFail();

        return new BookResource($book);
    }

    /**
     * Featured published books, newest first, capped at five.
     *
     * Envelope: `{"data": [...]}` (non-paginated).
     */
    public function featured()
    {
        $books = Book::query()
            ->published()
            ->featured()
            ->with('category')
            ->orderByDesc('added_at')
            ->orderByDesc('id')
            ->take(5)
            ->get();

        return new FeaturedBookCollection($books);
    }
}
