<?php

namespace App\Http\Requests;

use App\Concerns\ConvertsMoney;
use Illuminate\Foundation\Http\FormRequest;

class PaymentRequest extends FormRequest
{
    use ConvertsMoney;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->convertMoneyFields(['amount']);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'amount' => ['required', 'integer', 'min:1'],
            'paid_on' => ['required', 'date'],
            'method' => ['nullable', 'string', 'max:255'],
            'note' => ['nullable', 'string', 'max:255'],
        ];
    }
}
