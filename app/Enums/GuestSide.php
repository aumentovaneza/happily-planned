<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum GuestSide: string
{
    use HasOptions;

    case PartnerOne = 'partner_one';
    case PartnerTwo = 'partner_two';
    case Both = 'both';
    case Other = 'other';

    public function label(): string
    {
        return match ($this) {
            self::PartnerOne => 'Partner 1',
            self::PartnerTwo => 'Partner 2',
            self::Both => 'Both',
            self::Other => 'Other',
        };
    }
}
