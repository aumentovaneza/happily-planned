import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Plus, Trash2, UserPlus, X } from 'lucide-react';
import TableController from '@/actions/App/Http/Controllers/TableController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { seat } from '@/routes/guests';
import { index as seatingRoute } from '@/routes/seating';
import type { Option, SeatGuest, SeatingTable } from '@/types/wedding';

const NONE = 'none';

type Props = {
    tables: SeatingTable[];
    unseated: SeatGuest[];
    shapeOptions: Option[];
};

export default function SeatingPage({ tables, unseated, shapeOptions }: Props) {
    const [editing, setEditing] = useState<SeatingTable | null>(null);
    const [creating, setCreating] = useState(false);

    const assign = (guestId: number, tableId: number | null) =>
        router.patch(
            seat.url(guestId),
            { table_id: tableId },
            { preserveScroll: true },
        );

    const removeTable = (t: SeatingTable) => {
        if (confirm(`Remove "${t.name}"? Seated guests will be unassigned.`)) {
            router.delete(TableController.destroy.url(t.id), {
                preserveScroll: true,
            });
        }
    };

    const totalSeated = tables.reduce((s, t) => s + t.seats_used, 0);

    return (
        <>
            <Head title="Seating chart" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Seating chart
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {totalSeated} seated · {unseated.length} confirmed
                            guest(s) still to place
                        </p>
                    </div>
                    <Button onClick={() => setCreating(true)}>
                        <Plus /> Add table
                    </Button>
                </div>

                {unseated.length > 0 && (
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                                Waiting to be seated
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            {unseated.map((g) => (
                                <Badge key={g.id} variant="outline">
                                    {g.name}
                                    {g.plus_one ? ' +1' : ''}
                                </Badge>
                            ))}
                        </CardContent>
                    </Card>
                )}

                {tables.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center text-sm text-muted-foreground">
                            No tables yet. Add a table, then assign your confirmed
                            guests.
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {tables.map((t) => {
                            const over = t.seats_used > t.capacity;
                            return (
                                <Card
                                    key={t.id}
                                    className={over ? 'border-destructive' : undefined}
                                >
                                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-base">
                                            {t.name}
                                        </CardTitle>
                                        <div className="flex items-center gap-1">
                                            <Badge
                                                variant={
                                                    over ? 'destructive' : 'secondary'
                                                }
                                            >
                                                {t.seats_used}/{t.capacity}
                                            </Badge>
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
                                                onClick={() => removeTable(t)}
                                            >
                                                <Trash2 className="size-3.5" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {t.guests.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">
                                                No one seated here yet.
                                            </p>
                                        ) : (
                                            <ul className="space-y-1">
                                                {t.guests.map((g) => (
                                                    <li
                                                        key={g.id}
                                                        className="flex items-center justify-between rounded-md px-2 py-1 text-sm hover:bg-muted/50"
                                                    >
                                                        <span>
                                                            {g.name}
                                                            {g.plus_one ? (
                                                                <span className="text-muted-foreground">
                                                                    {' '}
                                                                    +1
                                                                </span>
                                                            ) : null}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-6"
                                                            onClick={() =>
                                                                assign(g.id, null)
                                                            }
                                                        >
                                                            <X className="size-3.5" />
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        {unseated.length > 0 && (
                                            <Select
                                                onValueChange={(v) =>
                                                    assign(Number(v), t.id)
                                                }
                                            >
                                                <SelectTrigger className="h-8">
                                                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                                                        <UserPlus className="size-3.5" />
                                                        <SelectValue placeholder="Seat a guest…" />
                                                    </span>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {unseated.map((g) => (
                                                        <SelectItem
                                                            key={g.id}
                                                            value={String(g.id)}
                                                        >
                                                            {g.name}
                                                            {g.plus_one ? ' +1' : ''}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {(creating || editing) && (
                <TableDialog
                    table={editing}
                    shapeOptions={shapeOptions}
                    onClose={() => {
                        setCreating(false);
                        setEditing(null);
                    }}
                />
            )}
        </>
    );
}

function TableDialog({
    table,
    shapeOptions,
    onClose,
}: {
    table: SeatingTable | null;
    shapeOptions: Option[];
    onClose: () => void;
}) {
    const form = useForm({
        name: table?.name ?? '',
        capacity: table?.capacity ? String(table.capacity) : '8',
        shape: table?.shape ?? NONE,
        notes: table?.notes ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.transform((data) => ({
            ...data,
            shape: data.shape === NONE ? null : data.shape,
        }));
        const opts = { preserveScroll: true, onSuccess: onClose };
        if (table) {
            form.patch(TableController.update.url(table.id), opts);
        } else {
            form.post(TableController.store.url(), opts);
        }
    };

    return (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>
                            {table ? 'Edit table' : 'Add table'}
                        </DialogTitle>
                        <DialogDescription>
                            Name the table and set how many it seats.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Table 1, Head table…"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                required
                                autoFocus
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="capacity">Capacity</Label>
                            <Input
                                id="capacity"
                                type="number"
                                min="1"
                                max="100"
                                value={form.data.capacity}
                                onChange={(e) =>
                                    form.setData('capacity', e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Shape</Label>
                        <Select
                            value={form.data.shape}
                            onValueChange={(v) => form.setData('shape', v)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={NONE}>Unspecified</SelectItem>
                                {shapeOptions.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                        {o.label}
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
                            {table ? 'Save' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

SeatingPage.layout = {
    breadcrumbs: [{ title: 'Seating chart', href: seatingRoute() }],
};
