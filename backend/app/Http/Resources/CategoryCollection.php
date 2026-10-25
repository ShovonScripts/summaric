<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

/**
 * Non-paginated list of categories.
 *
 * Serialized as the agreed envelope: `{"data": [ ... ]}`.
 */
class CategoryCollection extends ResourceCollection
{
    /**
     * The resource that this resource collects.
     */
    public $collects = CategoryResource::class;
}
