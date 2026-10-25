<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'author',
        'category_id',
        'year',
        'pages',
        'read_time',
        'summary',
        'key_ideas',
        'quote',
        'cover',
        'added_at',
        'featured',
        'status',
        'tags',
    ];

    protected $casts = [
        'key_ideas' => 'array',
        'cover' => 'array',
        'tags' => 'array',
        'added_at' => 'date',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    public function scopeByCategory($query, string $categorySlug)
    {
        return $query->whereHas('category', fn($q) => $q->where('slug', $categorySlug));
    }

    public function scopeSearch($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('author', 'like', "%{$search}%")
              ->orWhere('summary', 'like', "%{$search}%");
        });
    }

    public function scopeSort($query, string $sort)
    {
        return match ($sort) {
            'title' => $query->orderBy('title')->orderBy('id'),
            'read_time' => $query->orderBy('read_time')->orderBy('id'),
            default => $query->latest('added_at')->orderBy('id'),
        };
    }

    protected function coverArt(): Attribute
    {
        return Attribute::make(
            get: fn($value) => $value ?? null,
        );
    }
}