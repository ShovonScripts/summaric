<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Http\Resources\AdminCategoryResource;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    public function index(): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        $categories = Category::query()
            ->withCount('books')
            ->orderBy('name')
            ->orderBy('id')
            ->get();

        return AdminCategoryResource::collection($categories);
    }

    public function store(CategoryRequest $request): JsonResponse
    {
        $category = Category::create($request->validated());
        $category->loadCount('books');

        return (new AdminCategoryResource($category))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Category $category): AdminCategoryResource
    {
        $category->loadCount('books');

        return new AdminCategoryResource($category);
    }

    public function update(CategoryRequest $request, Category $category): AdminCategoryResource
    {
        $category->update($request->validated());
        $category->loadCount('books');

        return new AdminCategoryResource($category);
    }

    public function destroy(Category $category): JsonResponse
    {
        if ($category->books()->exists()) {
            return response()->json([
                'message' => 'Move or delete the books in this category first.',
            ], 422);
        }

        $category->delete();

        return response()->json(['message' => 'Category deleted.']);
    }
}
