<?php

namespace App\Support;

use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Thin wrapper over the Anthropic Messages API for the app's two light,
 * on-demand AI helpers (Budget Advisor + drinks tip). No SDK dependency —
 * a single HTTP call. When no API key is configured the app simply hides
 * the AI buttons, so this is only ever called once a key is present.
 */
class ClaudeClient
{
    private const ENDPOINT = 'https://api.anthropic.com/v1/messages';

    private const VERSION = '2023-06-01';

    public function isConfigured(): bool
    {
        return filled(config('services.anthropic.key'));
    }

    /**
     * Send a single-turn request and return Claude's text response.
     */
    public function complete(string $system, string $user, int $maxTokens = 2048): string
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException('Anthropic API key is not configured.');
        }

        $response = Http::withHeaders([
            'x-api-key' => config('services.anthropic.key'),
            'anthropic-version' => self::VERSION,
        ])
            ->timeout(60)
            ->post(self::ENDPOINT, [
                'model' => config('services.anthropic.model'),
                'max_tokens' => $maxTokens,
                'system' => $system,
                'messages' => [
                    ['role' => 'user', 'content' => $user],
                ],
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Claude request failed: '.$response->body());
        }

        // Concatenate the text blocks (thinking blocks, when present, are skipped).
        $text = collect($response->json('content', []))
            ->where('type', 'text')
            ->pluck('text')
            ->implode("\n");

        return trim($text);
    }
}
