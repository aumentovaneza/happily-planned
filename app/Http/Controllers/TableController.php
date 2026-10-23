<?php

namespace App\Http\Controllers;

use App\Enums\RsvpStatus;
use App\Enums\TableShape;
use App\Http\Requests\TableRequest;
use App\Models\Guest;
use App\Models\Table;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TableController extends Controller
{
    public function index(): Response
    {
        $tables = Table::query()
            ->with('guests:id,name,table_id,plus_one')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->map(fn (Table $table): array => [
                'id' => $table->id,
                'name' => $table->name,
                'capacity' => $table->capacity,
                'shape' => $table->shape?->value,
                'notes' => $table->notes,
                'guests' => $table->guests->map(fn (Guest $guest): array => [
                    'id' => $guest->id,
                    'name' => $guest->name,
                    'plus_one' => $guest->plus_one,
                    'seats' => $guest->headcount(),
                ])->values(),
                'seats_used' => $table->guests->sum(fn (Guest $guest) => $guest->headcount()),
            ]);

        // Confirmed guests still waiting for a table.
        $unseated = Guest::query()
            ->whereNull('table_id')
            ->where('rsvp_status', RsvpStatus::Confirmed)
            ->orderBy('name')
            ->get(['id', 'name', 'plus_one'])
            ->map(fn (Guest $guest): array => [
                'id' => $guest->id,
                'name' => $guest->name,
                'plus_one' => $guest->plus_one,
                'seats' => $guest->headcount(),
            ]);

        return Inertia::render('seating/index', [
            'tables' => $tables,
            'unseated' => $unseated,
            'shapeOptions' => TableShape::options(),
        ]);
    }

    public function store(TableRequest $request): RedirectResponse
    {
        Table::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Table added.')]);

        return to_route('seating.index');
    }

    public function update(TableRequest $request, Table $table): RedirectResponse
    {
        $table->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Table updated.')]);

        return to_route('seating.index');
    }

    public function destroy(Table $table): RedirectResponse
    {
        // Free the seated guests, then remove the table.
        $table->guests()->update(['table_id' => null]);
        $table->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Table removed.')]);

        return to_route('seating.index');
    }
}
