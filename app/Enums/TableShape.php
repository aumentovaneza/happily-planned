<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum TableShape: string
{
    use HasOptions;

    case Round = 'round';
    case Rectangle = 'rectangle';

    public function label(): string
    {
        return match ($this) {
            self::Round => 'Round',
            self::Rectangle => 'Rectangle',
        };
    }
}
