<?php

namespace App\Http\Requests;

use App\Models\Flag;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreFlagRequest extends FormRequest
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
            'reason' => ['nullable', 'string', 'max:1000'],
            'categories' => ['required', 'array', 'min:1'],
            'categories.*' => ['string', 'in:spam,scam,inaccurate,offensive,other'],
        ];
    }

    /**
     * Apply abuse protection for repeated reports from the same IP.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function () use ($validator): void {
            $windowStart = now()->subMinutes(60);
            $limit = 5;
            $recentCount = Flag::where('ip_address', $this->ip())
                ->where('created_at', '>=', $windowStart)
                ->count();

            if ($recentCount >= $limit) {
                $validator->errors()->add('reason', 'Too many reports from this IP. Please try again later.');
            }
        });
    }
}
