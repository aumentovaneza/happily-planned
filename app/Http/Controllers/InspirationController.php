<?php

namespace App\Http\Controllers;

use App\Http\Requests\InspirationRequest;
use App\Models\Inspiration;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InspirationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('inspiration/index', [
            'inspirations' => Inspiration::query()
                ->orderBy('sort_order')
                ->orderByDesc('id')
                ->get(),
        ]);
    }

    public function store(InspirationRequest $request): RedirectResponse
    {
        Inspiration::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Inspiration saved.')]);

        return to_route('inspiration.index');
    }

    public function update(InspirationRequest $request, Inspiration $inspiration): RedirectResponse
    {
        $inspiration->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Inspiration updated.')]);

        return to_route('inspiration.index');
    }

    public function destroy(Inspiration $inspiration): RedirectResponse
    {
        $inspiration->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Inspiration removed.')]);

        return to_route('inspiration.index');
    }
}
