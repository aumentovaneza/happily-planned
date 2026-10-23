<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\WeddingUpdateRequest;
use App\Models\Wedding;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class WeddingController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('settings/wedding', [
            'wedding' => Wedding::current(),
        ]);
    }

    public function update(WeddingUpdateRequest $request): RedirectResponse
    {
        Wedding::current()->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Wedding details updated.')]);

        return to_route('wedding.edit');
    }
}
