<?php

namespace App\Http\Controllers;

use App\Http\Requests\TimelineEventRequest;
use App\Models\TimelineEvent;
use App\Models\Vendor;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TimelineEventController extends Controller
{
    public function index(): Response
    {
        $events = TimelineEvent::query()
            ->with('vendor:id,name')
            ->orderBy('start_time')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('timeline/index', [
            'events' => $events->map(fn (TimelineEvent $event): array => [
                'id' => $event->id,
                'start_time' => $event->start_time->format('H:i'),
                'title' => $event->title,
                'location' => $event->location,
                'responsible' => $event->responsible,
                'vendor_id' => $event->vendor_id,
                'vendor' => $event->vendor?->name,
                'notes' => $event->notes,
            ]),
            'vendors' => Vendor::query()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(TimelineEventRequest $request): RedirectResponse
    {
        TimelineEvent::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event added.')]);

        return to_route('timeline.index');
    }

    public function update(TimelineEventRequest $request, TimelineEvent $timeline): RedirectResponse
    {
        $timeline->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event updated.')]);

        return to_route('timeline.index');
    }

    public function destroy(TimelineEvent $timeline): RedirectResponse
    {
        $timeline->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Event removed.')]);

        return to_route('timeline.index');
    }
}
