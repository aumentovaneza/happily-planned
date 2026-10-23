<?php

namespace App\Http\Controllers;

use App\Http\Requests\DrinkPlanRequest;
use App\Models\DrinkPlan;
use App\Models\Guest;
use App\Support\ClaudeClient;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class DrinksController extends Controller
{
    public function index(ClaudeClient $claude): Response
    {
        $plan = DrinkPlan::current();

        return Inertia::render('drinks/index', [
            'plan' => [
                'guest_count' => $plan->guest_count,
                'duration_hours' => $plan->duration_hours,
                'event_type' => $plan->event_type,
                'mix' => $plan->mix ?? ['beer' => 40, 'wine' => 30, 'spirits' => 20, 'non_alcoholic' => 10],
                'include_toast' => $plan->include_toast,
                'notes' => $plan->notes,
            ],
            'confirmedHeadcount' => Guest::confirmedHeadcount(),
            'ai' => [
                'enabled' => $claude->isConfigured(),
                'tip' => $plan->ai_tip,
                'generatedAt' => $plan->ai_tip_generated_at?->toIso8601String(),
            ],
        ]);
    }

    public function update(DrinkPlanRequest $request): RedirectResponse
    {
        DrinkPlan::current()->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Drink plan saved.')]);

        return to_route('drinks.index');
    }

    public function tip(ClaudeClient $claude): RedirectResponse
    {
        if (! $claude->isConfigured()) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('Add an Anthropic API key to enable AI tips.')]);

            return to_route('drinks.index');
        }

        $plan = DrinkPlan::current();
        $guests = $plan->guest_count ?? Guest::confirmedHeadcount();
        $mix = $plan->mix ?? ['beer' => 40, 'wine' => 30, 'spirits' => 20, 'non_alcoholic' => 10];

        $system = <<<'PROMPT'
        You are a practical bar-planning helper for a wedding in the Philippines. Give a short, friendly
        shopping and serving tip in Markdown: a quick bottle/serving shopping list, 1-2 money-saving ideas,
        and one signature-drink suggestion that fits the couple's drink mix. Keep it under ~180 words and do
        not add disclaimers about being an AI.
        PROMPT;

        $brief = sprintf(
            "Guests (attending): %d\nReception length: %d hours\nEvent type: %s\nDrink mix (%%): beer %d, wine %d, spirits %d, non-alcoholic %d\nToast drink for everyone: %s\nNotes: %s",
            $guests,
            $plan->duration_hours,
            $plan->event_type,
            $mix['beer'] ?? 0,
            $mix['wine'] ?? 0,
            $mix['spirits'] ?? 0,
            $mix['non_alcoholic'] ?? 0,
            $plan->include_toast ? 'yes' : 'no',
            $plan->notes ?: 'none',
        );

        try {
            $tip = $claude->complete($system, $brief);
        } catch (Throwable $e) {
            report($e);
            Inertia::flash('toast', ['type' => 'error', 'message' => __('The AI tip is unavailable right now. Please try again.')]);

            return to_route('drinks.index');
        }

        $plan->update(['ai_tip' => $tip, 'ai_tip_generated_at' => Carbon::now()]);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('AI tip ready.')]);

        return to_route('drinks.index');
    }
}
