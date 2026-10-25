<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * Non-paginated list of featured books (maximum five).
 *
 * Serialized as the agreed envelope: `{"data": [ ... ]}`.
 */
class FeaturedBookCollection extends ResourceCollection
{
    /**
     * The resource that this resource collects.
     */
    public $collects = BookResource::class;
}
