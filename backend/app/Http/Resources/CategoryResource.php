<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class CategoryResource extends BaseJsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'blurb' => $this->blurb,
            'motif' => $this->motif,
            'books_count' => $this->whenLoaded('publishedBooks', fn() => $this->publishedBooks->count()),
        ];
    }
}