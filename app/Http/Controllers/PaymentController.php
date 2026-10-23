<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentRequest;
use App\Models\BudgetItem;
use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function store(PaymentRequest $request, BudgetItem $budgetItem): RedirectResponse
    {
        $budgetItem->payments()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Payment recorded.')]);

        return to_route('budget.index');
    }

    public function update(PaymentRequest $request, Payment $payment): RedirectResponse
    {
        $payment->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Payment updated.')]);

        return to_route('budget.index');
    }

    public function destroy(Payment $payment): RedirectResponse
    {
        $payment->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Payment removed.')]);

        return to_route('budget.index');
    }
}
