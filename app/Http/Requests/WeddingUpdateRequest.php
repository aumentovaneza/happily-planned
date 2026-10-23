<?php

namespace App\Http\Requests;

use App\Concerns\ConvertsMoney;
use Illuminate\Foundation\Http\FormRequest;

class WeddingUpdateRequest extends FormRequest
{
    use ConvertsMoney;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->convertMoneyFields(['budget_ceiling']);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'partner_one_name' => ['nullable', 'string', 'max:255'],
            'partner_two_name' => ['nullable', 'string', 'max:255'],
            'wedding_date' => ['nullable', 'date'],
            'budget_ceiling' => ['nullable', 'integer', 'min:0'],
            'currency' => ['required', 'string', 'size:3'],
        ];
    }
}
