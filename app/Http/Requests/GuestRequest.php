<?php

namespace App\Http\Requests;

use App\Enums\GuestSide;
use App\Enums\RsvpStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class GuestRequest extends FormRequest
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
            'side' => ['required', Rule::enum(GuestSide::class)],
            'group' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'invited' => ['boolean'],
            'rsvp_status' => ['required', Rule::enum(RsvpStatus::class)],
            'plus_one' => ['boolean'],
            'plus_one_name' => ['nullable', 'string', 'max:255'],
            'table_id' => ['nullable', 'exists:tables,id'],
            'seat_note' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
