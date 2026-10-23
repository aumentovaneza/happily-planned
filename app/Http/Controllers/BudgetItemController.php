<?php

namespace App\Http\Controllers;

use App\Enums\BudgetItemStatus;
use App\Enums\CategoryType;
use App\Http\Requests\BudgetItemRequest;
use App\Models\BudgetItem;
use App\Models\Category;
use App\Models\Vendor;
use App\Models\Wedding;
use App\Support\BudgetSummary;
use App\Support\ClaudeClient;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BudgetItemController extends Controller
{
    public function index(ClaudeClient $claude): Response
    {
        $wedding = Wedding::current();

        $items = BudgetItem::query()
            ->with(['vendor:id,name', 'payments'])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        return Inertia::render('budget/index', [
            'wedding' => $wedding,
            'items' => $items->map(fn (BudgetItem $item): array => [
                'id' => $item->id,
                'category_id' => $item->category_id,
                'vendor_id' => $item->vendor_id,
                'vendor' => $item->vendor ? ['id' => $item->vendor->id, 'name' => $item->vendor->name] : null,
                'title' => $item->title,
                'estimated_amount' => $item->estimated_amount,
                'actual_amount' => $item->actual_amount,
                'paid' => $item->paidAmount(),
                'status' => $item->status->value,
                'due_date' => $item->due_date?->toDateString(),
                'notes' => $item->notes,
                'payments' => $item->payments
                    ->sortByDesc('paid_on')
                    ->values()
                    ->map(fn ($payment): array => [
                        'id' => $payment->id,
                        'amount' => $payment->amount,
                        'paid_on' => $payment->paid_on->toDateString(),
                        'method' => $payment->method,
                        'note' => $payment->note,
                    ]),
            ]),
            'summary' => BudgetSummary::for($items, $wedding->budget_ceiling),
            'categories' => Category::query()
                ->where('type', CategoryType::Budget)
                ->orderBy('sort_order')
                ->get(['id', 'name']),
            'vendors' => Vendor::query()->orderBy('name')->get(['id', 'name']),
            'statusOptions' => BudgetItemStatus::options(),
            'ai' => [
                'enabled' => $claude->isConfigured(),
                'summary' => $wedding->advisor_summary,
                'generatedAt' => $wedding->advisor_generated_at?->toIso8601String(),
            ],
        ]);
    }

    public function store(BudgetItemRequest $request): RedirectResponse
    {
        BudgetItem::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Budget item added.')]);

        return to_route('budget.index');
    }

    public function update(BudgetItemRequest $request, BudgetItem $budgetItem): RedirectResponse
    {
        $budgetItem->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Budget item updated.')]);

        return to_route('budget.index');
    }

    public function destroy(BudgetItem $budgetItem): RedirectResponse
    {
        $budgetItem->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Budget item removed.')]);

        return to_route('budget.index');
    }
}
