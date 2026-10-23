import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import TaskController from '@/actions/App/Http/Controllers/TaskController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { index as checklistRoute } from '@/routes/checklist';
import type { Task } from '@/types/wedding';

type Props = {
    tasks: Task[];
    progress: { total: number; done: number; percent: number };
};

function taskPayload(t: Task, overrides: Partial<Record<string, unknown>>) {
    return {
        title: t.title,
        category: t.category,
        due_date: t.due_date,
        is_done: t.is_done,
        notes: t.notes,
        ...overrides,
    };
}

export default function ChecklistPage({ tasks, progress }: Props) {
    const [editing, setEditing] = useState<Task | null>(null);
    const [creating, setCreating] = useState(false);
    const quick = useForm({ title: '' });

    const groups = useMemo(() => {
        const map = new Map<string, Task[]>();
        for (const t of tasks) {
            const key = t.category?.trim() || 'Other';
            map.set(key, [...(map.get(key) ?? []), t]);
        }
        return [...map.entries()];
    }, [tasks]);

    const toggle = (t: Task) =>
        router.patch(
            TaskController.update.url(t.id),
            taskPayload(t, { is_done: !t.is_done }),
            { preserveScroll: true },
        );

    const remove = (t: Task) =>
        router.delete(TaskController.destroy.url(t.id), { preserveScroll: true });

    const addQuick = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quick.data.title.trim()) return;
        quick.post(TaskController.store.url(), {
            preserveScroll: true,
            onSuccess: () => quick.reset('title'),
        });
    };

    return (
        <>
            <Head title="Checklist" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Checklist
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {progress.done}/{progress.total} tasks complete
                        </p>
                    </div>
                    <Button variant="outline" onClick={() => setCreating(true)}>
                        <Plus /> Add with details
                    </Button>
                </div>

                <Card>
                    <CardContent className="space-y-2 pt-6">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Progress</span>
                            <span className="text-primary font-semibold">
                                {progress.percent}%
                            </span>
                        </div>
                        <Progress value={progress.percent} />
                    </CardContent>
                </Card>

                <form onSubmit={addQuick} className="flex gap-2">
                    <Input
                        placeholder="Quick add a task…"
                        value={quick.data.title}
                        onChange={(e) => quick.setData('title', e.target.value)}
                    />
                    <Button type="submit" disabled={quick.processing}>
                        Add
                    </Button>
                </form>

                {groups.map(([category, items]) => {
                    const done = items.filter((t) => t.is_done).length;
                    return (
                        <Card key={category}>
                            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-base">
                                    {category}
                                </CardTitle>
                                <span className="text-sm text-muted-foreground">
                                    {done}/{items.length}
                                </span>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {items.map((t) => (
                                    <div
                                        key={t.id}
                                        className="group flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted/50"
                                    >
                                        <Checkbox
                                            checked={t.is_done}
                                            onCheckedChange={() => toggle(t)}
                                        />
                                        <div className="flex-1">
                                            <span
                                                className={
                                                    t.is_done
                                                        ? 'text-muted-foreground line-through'
                                                        : ''
                                                }
                                            >
                                                {t.title}
                                            </span>
                                            {t.due_date && (
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    due{' '}
                                                    {new Date(
                                                        t.due_date,
                                                    ).toLocaleDateString('en-PH', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex opacity-0 group-hover:opacity-100">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7"
                                                onClick={() => setEditing(t)}
                                            >
                                                <Pencil className="size-3.5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="size-7"
                                                onClick={() => remove(t)}
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {(creating || editing) && (
                <TaskDialog
                    task={editing}
                    onClose={() => {
                        setCreating(false);
                        setEditing(null);
                    }}
                />
            )}
        </>
    );
}

function TaskDialog({
    task,
    onClose,
}: {
    task: Task | null;
    onClose: () => void;
}) {
    const form = useForm({
        title: task?.title ?? '',
        category: task?.category ?? '',
        due_date: task?.due_date ?? '',
        is_done: task?.is_done ?? false,
        notes: task?.notes ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: onClose };
        if (task) {
            form.patch(TaskController.update.url(task.id), opts);
        } else {
            form.post(TaskController.store.url(), opts);
        }
    };

    return (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>{task ? 'Edit task' : 'Add task'}</DialogTitle>
                        <DialogDescription>
                            Group tasks by timeframe or category.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label htmlFor="title">Task</Label>
                        <Input
                            id="title"
                            value={form.data.title}
                            onChange={(e) => form.setData('title', e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                placeholder="e.g. 3 months out"
                                value={form.data.category}
                                onChange={(e) =>
                                    form.setData('category', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="due_date">Due date</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={form.data.due_date ?? ''}
                                onChange={(e) =>
                                    form.setData('due_date', e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            value={form.data.notes}
                            onChange={(e) => form.setData('notes', e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {task ? 'Save' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

ChecklistPage.layout = {
    breadcrumbs: [{ title: 'Checklist', href: checklistRoute() }],
};
