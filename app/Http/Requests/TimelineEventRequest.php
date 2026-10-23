<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TimelineEventRequest extends FormRequest
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
            'start_time' => ['required', 'date_format:H:i'],
            'title' => ['required', 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'responsible' => ['nullable', 'string', 'max:255'],
            'vendor_id' => ['nullable', 'exists:vendors,id'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
