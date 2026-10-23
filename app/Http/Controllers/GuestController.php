<?php

namespace App\Http\Controllers;

use App\Enums\GuestSide;
use App\Enums\RsvpStatus;
use App\Http\Requests\GuestRequest;
use App\Models\Guest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GuestController extends Controller
{
    public function index(): Response
    {
        $guests = Guest::query()->orderBy('name')->get();

        // Response-rate breakdown is based on invited guests only.
        $invited = $guests->where('invited', true);
        $invitedCount = $invited->count();
        $invitedConfirmed = $invited->where('rsvp_status', RsvpStatus::Confirmed)->count();
        $invitedDeclined = $invited->where('rsvp_status', RsvpStatus::Declined)->count();
        $invitedPending = $invited->where('rsvp_status', RsvpStatus::Pending)->count();
        $responded = $invitedConfirmed + $invitedDeclined;

        return Inertia::render('guests/index', [
            'guests' => $guests->map(fn (Guest $guest): array => [
                'id' => $guest->id,
                'name' => $guest->name,
                'side' => $guest->side->value,
                'group' => $guest->group,
                'phone' => $guest->phone,
                'email' => $guest->email,
                'invited' => $guest->invited,
                'rsvp_status' => $guest->rsvp_status->value,
                'plus_one' => $guest->plus_one,
                'plus_one_name' => $guest->plus_one_name,
                'notes' => $guest->notes,
            ]),
            'stats' => [
                'total' => $guests->count(),
                'invited' => $guests->where('invited', true)->count(),
                'confirmed' => $guests->where('rsvp_status', RsvpStatus::Confirmed)->count(),
                'declined' => $guests->where('rsvp_status', RsvpStatus::Declined)->count(),
                'pending' => $guests->where('rsvp_status', RsvpStatus::Pending)->count(),
                'headcount' => $guests
                    ->where('rsvp_status', RsvpStatus::Confirmed)
                    ->sum(fn (Guest $guest) => $guest->headcount()),
                'responseRate' => $invitedCount > 0 ? (int) round($responded / $invitedCount * 100) : 0,
                'invitedConfirmed' => $invitedConfirmed,
                'invitedDeclined' => $invitedDeclined,
                'invitedPending' => $invitedPending,
            ],
            'sideOptions' => GuestSide::options(),
            'rsvpOptions' => RsvpStatus::options(),
        ]);
    }

    public function store(GuestRequest $request): RedirectResponse
    {
        Guest::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Guest added.')]);

        return to_route('guests.index');
    }

    public function update(GuestRequest $request, Guest $guest): RedirectResponse
    {
        $guest->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Guest updated.')]);

        return to_route('guests.index');
    }

    public function destroy(Guest $guest): RedirectResponse
    {
        $guest->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Guest removed.')]);

        return to_route('guests.index');
    }

    /**
     * Assign (or clear) a guest's seating table. Used by the seating chart.
     */
    public function assignSeat(Request $request, Guest $guest): RedirectResponse
    {
        $validated = $request->validate([
            'table_id' => ['nullable', Rule::exists('tables', 'id')],
        ]);

        $guest->update(['table_id' => $validated['table_id'] ?? null]);

        return to_route('seating.index');
    }
}
