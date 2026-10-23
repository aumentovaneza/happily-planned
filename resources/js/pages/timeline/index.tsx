import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Clock, MapPin, Pencil, Plus, Trash2, User } from 'lucide-react';
import TimelineEventController from '@/actions/App/Http/Controllers/TimelineEventController';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { index as timelineRoute } from '@/routes/timeline';
import type { TimelineEvent } from '@/types/wedding';

const NONE = 'none';

type Props = {
    events: TimelineEvent[];
    vendors: { id: number; name: string }[];
};

function fmtTime(hhmm: string) {
    const [h, m] = hhmm.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m);
    return d.toLocaleTimeString('en-PH', {
        hour: 'numeric',
        minute: '2-digit',
    });
}

export default function TimelinePage({ events, vendors }: Props) {
    const [editing, setEditing] = useState<TimelineEvent | null>(null);
    const [creating, setCreating] = useState(false);

    const remove = (ev: TimelineEvent) => {
        if (confirm(`Remove "${ev.title}"?`)) {
            router.delete(TimelineEventController.destroy.url(ev.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Day-of timeline" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Day-of timeline
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            The hour-by-hour schedule for your wedding day.
                        </p>
                    </div>
                    <Button onClick={() => setCreating(true)}>
                        <Plus /> Add event
                    </Button>
                </div>

                {events.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center text-sm text-muted-foreground">
                            No events yet. Add the first moment of your day.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {events.map((ev) => (
                            <Card key={ev.id}>
                                <CardContent className="flex items-start gap-4 pt-6">
                                    <div className="flex w-20 shrink-0 flex-col items-center">
                                        <Clock className="size-4 text-primary" />
                                        <span className="mt-1 text-sm font-semibold">
                                            {fmtTime(ev.start_time)}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{ev.title}</div>
                                        <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-muted-foreground">
                                            {ev.location && (
                                                <span className="inline-flex items-center gap-1">
                                                    <MapPin className="size-3" />
                                                    {ev.location}
                                                </span>
                                            )}
                                            {(ev.responsible || ev.vendor) && (
                                                <span className="inline-flex items-center gap-1">
                                                    <User className="size-3" />
                                                    {[ev.responsible, ev.vendor]
                                                        .filter(Boolean)
                                                        .join(' · ')}
                                                </span>
                                            )}
                                        </div>
                                        {ev.notes && (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {ev.notes}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setEditing(ev)}
                                        >
                                            <Pencil className="size-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => remove(ev)}
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {(creating || editing) && (
                <EventDialog
                    event={editing}
                    vendors={vendors}
                    onClose={() => {
                        setCreating(false);
                        setEditing(null);
                    }}
                />
            )}
        </>
    );
}

function EventDialog({
    event,
    vendors,
    onClose,
}: {
    event: TimelineEvent | null;
    vendors: { id: number; name: string }[];
    onClose: () => void;
}) {
    const form = useForm({
        start_time: event?.start_time ?? '12:00',
        title: event?.title ?? '',
        location: event?.location ?? '',
        responsible: event?.responsible ?? '',
        vendor_id: event?.vendor_id ? String(event.vendor_id) : NONE,
        notes: event?.notes ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.transform((data) => ({
            ...data,
            vendor_id: data.vendor_id === NONE ? null : data.vendor_id,
        }));
        const opts = { preserveScroll: true, onSuccess: onClose };
        if (event) {
            form.patch(TimelineEventController.update.url(event.id), opts);
        } else {
            form.post(TimelineEventController.store.url(), opts);
        }
    };

    return (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>
                            {event ? 'Edit event' : 'Add event'}
                        </DialogTitle>
                        <DialogDescription>
                            A moment in your wedding-day schedule.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
                        <div className="grid gap-2">
                            <Label htmlFor="start_time">Time</Label>
                            <Input
                                id="start_time"
                                type="time"
                                value={form.data.start_time}
                                onChange={(e) =>
                                    form.setData('start_time', e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={form.data.title}
                                onChange={(e) =>
                                    form.setData('title', e.target.value)
                                }
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={form.data.location}
                                onChange={(e) =>
                                    form.setData('location', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="responsible">Responsible</Label>
                            <Input
                                id="responsible"
                                placeholder="Person"
                                value={form.data.responsible}
                                onChange={(e) =>
                                    form.setData('responsible', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Vendor</Label>
                        <Select
                            value={form.data.vendor_id}
                            onValueChange={(v) => form.setData('vendor_id', v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={NONE}>None</SelectItem>
                                {vendors.map((v) => (
                                    <SelectItem key={v.id} value={String(v.id)}>
                                        {v.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                            {event ? 'Save' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

TimelinePage.layout = {
    breadcrumbs: [{ title: 'Day-of timeline', href: timelineRoute() }],
};
