<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class FeaturedBookCollection extends ResourceCollection
{
    public function __construct($resource)
    {
        parent::__construct($resource);
        $this->withoutWrapping();
    }

    public function toArray(Request $request): array
    {
        return $this->collection->toArray();
    }
}