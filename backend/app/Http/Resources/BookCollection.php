<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * Paginated book listing.
 *
 * Laravel's paginated resource response produces the agreed envelope:
 *
 * ```json
 * { "data": [ ... ], "meta": { ... }, "links": { ... } }
 * ```
 *
 * `meta.last_page` (and every other meta value) comes straight from the
 * length-aware paginator, so it is a real integer and is never hardcoded.
 */
class BookCollection extends ResourceCollection
{
    /**
     * The resource that this resource collects.
     */
    public $collects = BookResource::class;
}
