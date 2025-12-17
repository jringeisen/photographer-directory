<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListingSearchRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'q' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function searchTerm(): ?string
    {
        $term = $this->validated('q');

        if ($term === null) {
            return null;
        }

        $trimmed = trim($term);

        return $trimmed === '' ? null : $trimmed;
    }
}
