<?php

namespace App\Enums\Concerns;

/**
 * Builds {value, label} option lists for frontend selects. Expects the enum
 * to define a label() method.
 */
trait HasOptions
{
    /**
     * @return array<int, array{value: string, label: string}>
     */
    public static function options(): array
    {
        return array_map(
            fn (self $case): array => ['value' => $case->value, 'label' => $case->label()],
            self::cases(),
        );
    }
}
