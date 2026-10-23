<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DrinkPlanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'guest_count' => ['nullable', 'integer', 'min:0', 'max:100000'],
            'duration_hours' => ['required', 'integer', 'min:1', 'max:24'],
            'event_type' => ['required', 'string', 'max:255'],
            'mix' => ['required', 'array'],
            'mix.beer' => ['required', 'integer', 'min:0', 'max:100'],
            'mix.wine' => ['required', 'integer', 'min:0', 'max:100'],
            'mix.spirits' => ['required', 'integer', 'min:0', 'max:100'],
            'mix.non_alcoholic' => ['required', 'integer', 'min:0', 'max:100'],
            'include_toast' => ['boolean'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
