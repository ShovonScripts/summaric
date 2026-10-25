<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\AdminBookResource;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $counts = Book::query()
            ->selectRaw('status, count(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $published = (int) ($counts['published'] ?? 0);
        $draft = (int) ($counts['draft'] ?? 0);
        $review = (int) ($counts['review'] ?? 0);

        $recent = Book::query()
            ->with('category')
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->limit(6)
            ->get();

        return response()->json([
            'data' => [
                'stats' => [
                    'total' => $published + $draft + $review,
                    'published' => $published,
                    'draft' => $draft,
                    'review' => $review,
                    'categories' => Category::count(),
                    'featured' => Book::query()->where('featured', true)->count(),
                ],
                'recent_books' => AdminBookResource::collection($recent)->resolve(),
            ],
        ]);
    }
}
