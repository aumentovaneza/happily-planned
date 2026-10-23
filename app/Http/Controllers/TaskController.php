<?php

namespace App\Http\Controllers;

use App\Http\Requests\TaskRequest;
use App\Models\Task;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TaskController extends Controller
{
    public function index(): Response
    {
        $tasks = Task::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'title', 'category', 'due_date', 'is_done', 'notes', 'sort_order']);

        $total = $tasks->count();
        $done = $tasks->where('is_done', true)->count();

        return Inertia::render('checklist/index', [
            'tasks' => $tasks->map(fn (Task $task): array => [
                'id' => $task->id,
                'title' => $task->title,
                'category' => $task->category,
                'due_date' => $task->due_date?->toDateString(),
                'is_done' => $task->is_done,
                'notes' => $task->notes,
            ]),
            'progress' => [
                'total' => $total,
                'done' => $done,
                'percent' => $total > 0 ? (int) round($done / $total * 100) : 0,
            ],
        ]);
    }

    public function store(TaskRequest $request): RedirectResponse
    {
        Task::create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task added.')]);

        return to_route('checklist.index');
    }

    public function update(TaskRequest $request, Task $checklist): RedirectResponse
    {
        $checklist->update($request->validated());

        return to_route('checklist.index');
    }

    public function destroy(Task $checklist): RedirectResponse
    {
        $checklist->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Task removed.')]);

        return to_route('checklist.index');
    }
}
