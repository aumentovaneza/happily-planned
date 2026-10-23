<?php

namespace App\Http\Controllers;

use App\Models\BudgetItem;
use App\Models\Wedding;
use App\Support\ClaudeClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Throwable;

class BudgetAdvisorController extends Controller
{
    public function generate(ClaudeClient $claude): RedirectResponse
    {
        if (! $claude->isConfigured()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('Add an Anthropic API key to enable the Budget Advisor.')]);

            return to_route('budget.index');
        }

        $wedding = Wedding::current();

        $system = <<<'PROMPT'
        You are a practical, warm wedding budget advisor for a couple planning their wedding in the Philippines.
        All amounts are in Philippine Pesos (PHP). Give concise, specific, actionable advice in short Markdown
        sections with bullet points. Cover: (1) categories that look high or low versus typical Philippine wedding
        allocations, (2) concrete ways to trim without hurting the day, and (3) common line items they may have
        forgotten. Keep it under ~250 words. Do not add disclaimers about being an AI.
        PROMPT;

        try {
            $summary = $claude->complete($system, $this->buildBudgetBrief($wedding));
        } catch (Throwable $e) {
            report($e);
            Inertia::flash('toast', ['type' => 'error', 'message' => __('The Budget Advisor is unavailable right now. Please try again.')]);

            return to_route('budget.index');
        }

        $wedding->update([
            'advisor_summary' => $summary,
            'advisor_generated_at' => Carbon::now(),
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Budget advice generated.')]);

        return to_route('budget.index');
    }

    private function buildBudgetBrief(Wedding $wedding): string
    {
        $peso = fn (?int $centavos): string => '₱'.number_format(($centavos ?? 0) / 100, 2);

        $lines = [];
        $lines[] = 'Overall budget ceiling: '.($wedding->budget_ceiling ? $peso($wedding->budget_ceiling) : 'not set');
        $lines[] = '';
        $lines[] = 'Budget line items (title | category | estimated | actual | status):';

        $items = BudgetItem::query()->with('category:id,name')->get();

        foreach ($items as $item) {
            $lines[] = sprintf(
                '- %s | %s | est %s | actual %s | %s',
                $item->title,
                $item->category?->name ?? 'Uncategorized',
                $peso($item->estimated_amount),
                $item->actual_amount !== null ? $peso($item->actual_amount) : 'TBD',
                $item->status->value,
            );
        }

        if ($items->isEmpty()) {
            $lines[] = '- (no items yet — suggest a starter budget breakdown)';
        }

        return implode("\n", $lines);
    }
}
