<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryCollection;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::with('publishedBooks')
            ->orderBy('name')
            ->get();

        return new CategoryCollection($categories);
    }

    public function show(Request $request, string $slug)
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        return (new \App\Http\Resources\CategoryResource($category))->withoutWrapping();
    }
}