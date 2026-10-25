<?php

namespace App\Http\Requests\Admin;

use App\Models\Book;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BookRequest extends FormRequest
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
        /** @var Book|null $book */
        $book = $this->route('book');

        return [
            'slug' => [
                'required',
                'string',
                'max:255',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique('books', 'slug')->ignore($book?->id),
            ],
            'title' => ['required', 'string', 'max:255'],
            'author' => ['required', 'string', 'max:255'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'year' => ['nullable', 'integer', 'between:1000,2100'],
            'pages' => ['nullable', 'integer', 'between:1,20000'],
            'read_time' => ['nullable', 'integer', 'between:1,600'],
            'summary' => ['nullable', 'string'],
            'key_ideas' => ['nullable', 'array', 'max:20'],
            'key_ideas.*' => ['string', 'max:1000'],
            'quote' => ['nullable', 'string', 'max:2000'],
            'cover' => ['nullable', 'array'],
            'cover.base' => ['required_with:cover', 'string', 'max:32'],
            'cover.accent' => ['required_with:cover', 'string', 'max:32'],
            'cover.ink' => ['required_with:cover', 'string', 'max:32'],
            'cover.motif' => ['required_with:cover', Rule::in(self::MOTIFS)],
            'added_at' => ['nullable', 'date'],
            'featured' => ['boolean'],
            'status' => ['required', Rule::in(['published', 'draft', 'review'])],
            'tags' => ['nullable', 'array', 'max:20'],
            'tags.*' => ['string', 'max:50'],
        ];
    }
}
