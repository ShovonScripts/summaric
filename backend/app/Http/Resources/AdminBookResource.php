<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * A book as exposed to the admin panel: every public field plus the
 * internal identifiers and the moderation status.
 *
 * @mixin \App\Models\Book
 */
class AdminBookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'title' => $this->title,
            'author' => $this->author,
            'category_id' => $this->category_id,
            'category' => $this->whenLoaded(
                'category',
                fn () => new CategoryResource($this->category),
            ),
            'year' => $this->year,
            'pages' => $this->pages,
            'read_time' => $this->read_time,
            'summary' => $this->summary,
            'key_ideas' => $this->key_ideas ?? [],
            'quote' => $this->quote,
            'cover' => $this->cover,
            'added_at' => $this->added_at?->toDateString(),
            'featured' => (bool) $this->featured,
            'status' => $this->status,
            'tags' => $this->tags ?? [],
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
