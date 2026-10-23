<?php

namespace App\Http\Requests;

use App\Enums\TableShape;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TableRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1', 'max:100'],
            'shape' => ['nullable', Rule::enum(TableShape::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
