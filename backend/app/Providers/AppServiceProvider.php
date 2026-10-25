<?php

namespace App\Providers;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Public API response contract (see docs/phase-4d-books-api.md):
        //
        //   single resource          -> { "data": { ... } }
        //   non-paginated collection -> { "data": [ ... ] }
        //   paginated collection     -> { "data": [ ... ], "meta": { ... }, "links": { ... } }
        //
        // "data" is already Laravel's default wrap key; it is declared here so
        // the contract lives in one place. Resources must never disable the
        // wrapper themselves (JsonResource::withoutWrapping() is global), and
        // collections must never hand-roll a "data" key inside toArray().
        JsonResource::wrap('data');
    }
}
