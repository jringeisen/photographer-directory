<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreListingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:255'],
            'state' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20', 'required_without:email'],
            'email' => ['nullable', 'email', 'max:255', 'required_without:phone'],
            'description' => ['nullable', 'string', 'max:5000'],
            'photography_types' => ['required', 'array', 'min:1'],
            'photography_types.*' => ['integer', 'exists:photography_types,id'],
            'custom_types' => ['nullable', 'array'],
            'custom_types.*' => ['string', 'max:50'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:5120'],
            'uploaded_images' => ['nullable', 'array', 'max:10'],
            'uploaded_images.*' => ['string'],
        ];
    }

    public function messages(): array
    {
        return [
            'phone.required_without' => 'Please provide either a phone number or email address.',
            'email.required_without' => 'Please provide either a phone number or email address.',
            'photography_types.required' => 'Please select at least one photography type.',
            'images.max' => 'You can upload a maximum of 10 images.',
        ];
    }
}
