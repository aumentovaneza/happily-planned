<?php

namespace App\Enums;

use App\Enums\Concerns\HasOptions;

enum VendorStatus: string
{
    use HasOptions;

    case Considering = 'considering';
    case Shortlisted = 'shortlisted';
    case Booked = 'booked';
    case Rejected = 'rejected';

    public function label(): string
    {
        return match ($this) {
            self::Considering => 'Considering',
            self::Shortlisted => 'Shortlisted',
            self::Booked => 'Booked',
            self::Rejected => 'Rejected',
        };
    }
}
