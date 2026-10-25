<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BookRequest;
use App\Http\Resources\AdminBookResource;
use App\Models\Book;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class BookController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Book::query()->with('category');

        if (in_array($request->input('status'), ['published', 'draft', 'review'], true)) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $query->search($request->string('search')->toString());
        }

        if ($request->filled('category')) {
            $query->byCategory($request->string('category')->toString());
        }

        $query->orderByDesc('updated_at')->orderByDesc('id');

        $perPage = max(1, min($request->integer('per_page', 20), 100));
        $books = $query->paginate($perPage)->withQueryString();

        return AdminBookResource::collection($books);
    }

    public function store(BookRequest $request): JsonResponse
    {
        $book = Book::create($request->validated());

        return (new AdminBookResource($book->load('category')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Book $book): AdminBookResource
    {
        return new AdminBookResource($book->load('category'));
    }

    public function update(BookRequest $request, Book $book): AdminBookResource
    {
        $book->update($request->validated());

        return new AdminBookResource($book->load('category'));
    }

    public function destroy(Book $book): JsonResponse
    {
        $book->delete();

        return response()->json(['message' => 'Book deleted.']);
    }
}
