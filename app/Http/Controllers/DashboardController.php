<?php

namespace App\Http\Controllers;

use App\Enums\RsvpStatus;
use App\Enums\VendorStatus;
use App\Models\BudgetItem;
use App\Models\Guest;
use App\Models\Task;
use App\Models\Vendor;
use App\Models\Wedding;
use App\Support\BudgetSummary;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $wedding = Wedding::current();

        $items = BudgetItem::query()->with('payments')->get();
        $summary = BudgetSummary::for($items, $wedding->budget_ceiling);

        $tasksTotal = Task::query()->count();
        $tasksDone = Task::query()->where('is_done', true)->count();

        return Inertia::render('dashboard', [
            'wedding' => $wedding,
            'daysUntil' => $wedding->wedding_date
                ? (int) Carbon::today()->diffInDays($wedding->wedding_date, false)
                : null,
            'budget' => $summary,
            'vendors' => [
                'total' => Vendor::query()->count(),
                'booked' => Vendor::query()->where('status', VendorStatus::Booked)->count(),
            ],
            'checklist' => [
                'total' => $tasksTotal,
                'done' => $tasksDone,
                'percent' => $tasksTotal > 0 ? (int) round($tasksDone / $tasksTotal * 100) : 0,
            ],
            'guests' => [
                'total' => Guest::query()->count(),
                'confirmed' => Guest::query()->where('rsvp_status', RsvpStatus::Confirmed)->count(),
                'pending' => Guest::query()->where('rsvp_status', RsvpStatus::Pending)->count(),
                'headcount' => Guest::confirmedHeadcount(),
            ],
        ]);
    }
}
