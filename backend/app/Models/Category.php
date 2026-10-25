<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'blurb',
        'motif',
    ];

    public function books(): HasMany
    {
        return $this->hasMany(Book::class);
    }

    public function publishedBooks(): HasMany
    {
        return $this->hasMany(Book::class)->where('status', 'published');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}