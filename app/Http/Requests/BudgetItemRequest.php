<?php

namespace App\Http\Requests;

use App\Concerns\ConvertsMoney;
use App\Enums\BudgetItemStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BudgetItemRequest extends FormRequest
{
    use ConvertsMoney;

    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->convertMoneyFields(['estimated_amount', 'actual_amount']);

        // Planned amount is non-nullable; treat blank as zero.
        $this->merge(['estimated_amount' => $this->input('estimated_amount') ?? 0]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'category_id' => ['nullable', 'exists:categories,id'],
            'vendor_id' => ['nullable', 'exists:vendors,id'],
            'title' => ['required', 'string', 'max:255'],
            'estimated_amount' => ['required', 'integer', 'min:0'],
            'actual_amount' => ['nullable', 'integer', 'min:0'],
            'status' => ['required', Rule::enum(BudgetItemStatus::class)],
            'due_date' => ['nullable', 'date'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
