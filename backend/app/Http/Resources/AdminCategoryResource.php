<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A category as exposed to the admin panel, including the total number of
 * books in every status (not only published ones).
 *
 * @mixin \App\Models\Category
 */
class AdminCategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
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
