<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;
use App\Models\Category;

class CategoryController extends Controller
{
    /**
     * All categories with their published-book count.
     *
     * The count is eager-loaded through `withCount` (a single query with a
     * correlated subquery — no N+1) and is serialized as a number.
     *
     * Envelope: `{"data": [...]}`.
     */
    public function index()
    {
        $categories = Category::query()
            ->withCount(['publishedBooks as books_count'])
            ->orderBy('name')
            ->orderBy('id')
            ->get();

        return new CategoryCollection($categories);
    }

    /**
     * A single category with its published-book count.
     *
     * Envelope: `{"data": {...}}`.
     */
    public function show(string $slug)
    {
        $category = Category::query()
            ->withCount(['publishedBooks as books_count'])
            ->where('slug', $slug)
            ->firstOrFail();

        return new CategoryResource($category);
    }
}
