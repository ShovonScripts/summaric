<?php

namespace App\Http\Requests\Admin;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CategoryRequest extends FormRequest
{
    public const MOTIFS = [
        'ripple',
        'wave',
        'orbit',
        'grid',
        'sun',
        'steps',
        'moon',
        'stack',
        'spiral',
        'arch',
    ];

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('slug'))) {
            $this->merge(['slug' => strtolower(trim($this->input('slug')))]);
        }
    }

    public function rules(): array
    {
        /** @var Category|null $category */
        $category = $this->route('category');

        return [
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('categories', 'slug')->ignore($category?->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'blurb' => ['required', 'string', 'max:1000'],
            'motif' => ['required', Rule::in(self::MOTIFS)],
        ];
    }
}
