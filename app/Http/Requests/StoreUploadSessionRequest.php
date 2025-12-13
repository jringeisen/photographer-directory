<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUploadSessionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'filename' => ['required', 'string', 'max:255'],
            'content_length' => ['required', 'integer', 'min:1', 'max:52428800'],
            'content_type' => ['required', 'string', 'in:image/jpeg,image/png,image/webp'],
            'purpose' => ['required', 'string', 'in:listing,portfolio'],
        ];
    }
}
