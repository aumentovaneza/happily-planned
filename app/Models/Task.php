<?php

namespace App\Models;

use Database\Factories\TaskFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['title', 'category', 'due_date', 'is_done', 'notes', 'sort_order'])]
class Task extends Model
{
    /** @use HasFactory<TaskFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'due_date' => 'date',
            'is_done' => 'boolean',
        ];
    }
}
