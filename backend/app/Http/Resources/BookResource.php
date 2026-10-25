<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;

class BookResource extends BaseJsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->title,
            'author' => $this->author,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'year' => $this->year,
            'pages' => $this->pages,
            'read_time' => $this->read_time,
            'summary' => $this->summary,
            'key_ideas' => $this->key_ideas,
            'quote' => $this->quote,
            'cover' => $this->cover,
            'added_at' => $this->added_at?->toDateString(),
            'featured' => $this->featured,
            'status' => $this->status,
            'tags' => $this->tags,
        ];
    }
}