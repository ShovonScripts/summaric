<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A single category.
 *
 * `books_count` is only serialized when the controller eager-loaded the
 * published-book count (`withCount(['publishedBooks as books_count'])`).
 * It is always a JSON number, never a string.
 *
 * @mixin \App\Models\Category
 */
class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'name' => $this->name,
            'blurb' => $this->blurb,
            'motif' => $this->motif,
            'books_count' => $this->when(
                array_key_exists('books_count', $this->resource->getAttributes()),
                fn () => (int) $this->resource->getAttributes()['books_count'],
            ),
        ];
    }
}
