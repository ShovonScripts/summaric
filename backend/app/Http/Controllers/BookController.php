<?php

namespace App\Http\Controllers;

use App\Http\Resources\BookCollection;
use App\Http\Resources\BookResource;
use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
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

        // Sorting
        $sort = $request->string('sort')->toString();
        $query->sort($sort);

        // Pagination
        $perPage = min($request->integer('per_page', 12), 50);
        $books = $query->paginate($perPage)->withQueryString();

        return new BookCollection($books);
    }

    public function show(Request $request, string $slug)
    {
        $book = Book::query()
            ->published()
            ->with('category')
            ->where('slug', $slug)
            ->firstOrFail();

        return (new BookResource($book))->withoutWrapping();
    }

public function featured(Request $request)
    {
        $books = Book::query()
            ->published()
            ->featured()
            ->with('category')
            ->latest('added_at')
            ->take(5)
            ->get();

        return new \App\Http\Resources\FeaturedBookCollection($books);
}
}