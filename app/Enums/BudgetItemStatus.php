<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum BudgetItemStatus: string
{
    use HasOptions;

    case Committed = 'committed';
    case Considering = 'considering';

    public function label(): string
    {
        return match ($this) {
            self::Committed => 'Committed',
            self::Considering => 'Considering',
        };
    }
}
