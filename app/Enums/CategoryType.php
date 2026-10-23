<?php

namespace App\Enums;

enum CategoryType: string
{
    case Budget = 'budget';
    case Vendor = 'vendor';

    public function label(): string
    {
        return match ($this) {
            self::Budget => 'Budget',
            self::Vendor => 'Vendor',
        };
    }
}
