<?php

namespace App\Models;

use Database\Factories\InspirationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'url', 'category', 'thumbnail_url', 'notes', 'sort_order'])]
class Inspiration extends Model
{
    /** @use HasFactory<InspirationFactory> */
    use HasFactory;
}
