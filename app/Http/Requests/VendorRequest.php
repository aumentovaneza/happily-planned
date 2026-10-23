<?php

namespace App\Http\Requests;

use App\Concerns\ConvertsMoney;
use App\Enums\VendorStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VendorRequest extends FormRequest
{
    use ConvertsMoney;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->convertMoneyFields(['quoted_price']);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['nullable', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'website' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'quoted_price' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', Rule::enum(VendorStatus::class)],
            'rating' => ['nullable', 'integer', 'between:1,5'],
            'pros' => ['nullable', 'string'],
            'cons' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
