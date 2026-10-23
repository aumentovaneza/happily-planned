<?php

namespace App\Http\Controllers;

use App\Enums\CategoryType;
use App\Enums\VendorStatus;
use App\Http\Requests\VendorRequest;
use App\Models\Category;
use App\Models\Vendor;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function index(): Response
    {
        $vendors = Vendor::query()
            ->with('category:id,name')
            ->withCount('budgetItems')
            ->orderBy('name')
            ->get()
            ->map(fn (Vendor $vendor): array => [
                'id' => $vendor->id,
                'category_id' => $vendor->category_id,
                'category' => $vendor->category?->name,
                'name' => $vendor->name,
                'phone' => $vendor->phone,
                'email' => $vendor->email,
                'website' => $vendor->website,
                'instagram' => $vendor->instagram,
                'quoted_price' => $vendor->quoted_price,
                'status' => $vendor->status->value,
                'rating' => $vendor->rating,
                'pros' => $vendor->pros,
                'cons' => $vendor->cons,
                'notes' => $vendor->notes,
                'budget_items_count' => $vendor->budget_items_count,
            ]);

        return Inertia::render('vendors/index', [
            'vendors' => $vendors,
            'categories' => Category::query()
                ->where('type', CategoryType::Vendor)
                ->orderBy('sort_order')
                ->get(['id', 'name']),
            'statusOptions' => VendorStatus::options(),
        ]);
    }

    public function store(VendorRequest $request): RedirectResponse
    {
        Vendor::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Vendor added.')]);

        return to_route('vendors.index');
    }

    public function update(VendorRequest $request, Vendor $vendor): RedirectResponse
    {
        $vendor->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Vendor updated.')]);

        return to_route('vendors.index');
    }

    public function destroy(Vendor $vendor): RedirectResponse
    {
        $vendor->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Vendor removed.')]);

        return to_route('vendors.index');
    }
}
