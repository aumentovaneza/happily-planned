import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    CalendarCheck,
    Clock,
    Pencil,
    Plus,
    Trash2,
    UsersRound,
    XCircle,
    type LucideIcon,
} from 'lucide-react';
import GuestController from '@/actions/App/Http/Controllers/GuestController';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { index as guestsRoute } from '@/routes/guests';
import type { Guest, Option } from '@/types/wedding';

type Stats = {
    total: number;
    invited: number;
    confirmed: number;
    declined: number;
    pending: number;
    headcount: number;
    responseRate: number;
    invitedConfirmed: number;
    invitedDeclined: number;
    invitedPending: number;
};

type Props = {
    guests: Guest[];
    stats: Stats;
    sideOptions: Option[];
    rsvpOptions: Option[];
};

function guestPayload(g: Guest, overrides: Partial<Record<string, unknown>>) {
    return {
        name: g.name,
        side: g.side,
        group: g.group,
        phone: g.phone,
        email: g.email,
        invited: g.invited,
        rsvp_status: g.rsvp_status,
        plus_one: g.plus_one,
        plus_one_name: g.plus_one_name,
        notes: g.notes,
        ...overrides,
    };
}

export default function GuestsPage({
    guests,
    stats,
    sideOptions,
    rsvpOptions,
}: Props) {
    const [editing, setEditing] = useState<Guest | null>(null);
    const [creating, setCreating] = useState(false);

    const sideLabel = (v: string) =>
        sideOptions.find((o) => o.value === v)?.label ?? v;

    const patchGuest = (g: Guest, overrides: Partial<Record<string, unknown>>) =>
        router.patch(GuestController.update.url(g.id), guestPayload(g, overrides), {
            preserveScroll: true,
        });

    const remove = (g: Guest) => {
        if (confirm(`Remove "${g.name}"?`)) {
            router.delete(GuestController.destroy.url(g.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Guests" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Guests &amp; RSVP
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Track who's invited and how they've replied.
                        </p>
                    </div>
                    <Button onClick={() => setCreating(true)}>
                        <Plus /> Add guest
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Stat
                        label="Total Attending"
                        value={stats.headcount}
                        icon={UsersRound}
                        accent
                    />
                    <Stat
                        label="Confirmed"
                        value={stats.confirmed}
                        icon={CalendarCheck}
                    />
                    <Stat label="Pending" value={stats.pending} icon={Clock} />
                    <Stat label="Declined" value={stats.declined} icon={XCircle} />
                </div>

                <ResponseRate stats={stats} />

                <Card>
                    <CardContent className="pt-6">
                        {guests.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No guests yet. Add your first guest.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Side</TableHead>
                                        <TableHead>Group</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Invited</TableHead>
                                        <TableHead>RSVP</TableHead>
                                        <TableHead>+1</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {guests.map((g) => (
                                        <TableRow key={g.id}>
                                            <TableCell className="font-medium">
                                                {g.name}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {sideLabel(g.side)}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {g.group ?? '—'}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {g.phone || g.email || '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    checked={g.invited}
                                                    onCheckedChange={(c) =>
                                                        patchGuest(g, {
                                                            invited: c === true,
                                                        })
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={g.rsvp_status}
                                                    onValueChange={(v) =>
                                                        patchGuest(g, {
                                                            rsvp_status: v,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="h-8 w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {rsvpOptions.map((o) => (
                                                            <SelectItem
                                                                key={o.value}
                                                                value={o.value}
                                                            >
                                                                {o.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {g.plus_one
                                                    ? g.plus_one_name || 'Yes'
                                                    : '—'}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setEditing(g)}
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => remove(g)}
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            {(creating || editing) && (
                <GuestDialog
                    guest={editing}
                    sideOptions={sideOptions}
                    rsvpOptions={rsvpOptions}
                    onClose={() => {
                        setCreating(false);
                        setEditing(null);
                    }}
                />
            )}
        </>
    );
}

function Stat({
    label,
    value,
    icon: Icon,
    accent,
}: {
    label: string;
    value: number;
    icon: LucideIcon;
    accent?: boolean;
}) {
    return (
        <Card className={accent ? 'border-primary/40' : undefined}>
            <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" />
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        {label}
                    </p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

function ResponseRate({ stats }: { stats: Stats }) {
    const base = stats.invited;
    const pct = (n: number) => (base > 0 ? (n / base) * 100 : 0);

    const segments = [
        { label: 'Confirmed', value: stats.invitedConfirmed, bar: 'bg-primary' },
        { label: 'Declined', value: stats.invitedDeclined, bar: 'bg-chart-2' },
        {
            label: 'Pending',
            value: stats.invitedPending,
            bar: 'bg-muted-foreground/40',
        },
    ];

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Response Rate</p>
                    <p className="text-sm font-semibold">{stats.responseRate}%</p>
                </div>
                <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-muted">
                    {segments.map((s) => (
                        <div
                            key={s.label}
                            className={s.bar}
                            style={{ width: `${pct(s.value)}%` }}
                        />
                    ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-4">
                    {segments.map((s) => (
                        <span
                            key={s.label}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground"
                        >
                            <span
                                className={`size-2 rounded-full ${s.bar}`}
                                aria-hidden
                            />
                            {s.label}
                        </span>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function GuestDialog({
    guest,
    sideOptions,
    rsvpOptions,
    onClose,
}: {
    guest: Guest | null;
    sideOptions: Option[];
    rsvpOptions: Option[];
    onClose: () => void;
}) {
    const form = useForm({
        name: guest?.name ?? '',
        side: guest?.side ?? 'other',
        group: guest?.group ?? '',
        phone: guest?.phone ?? '',
        email: guest?.email ?? '',
        invited: guest?.invited ?? false,
        rsvp_status: guest?.rsvp_status ?? 'pending',
        plus_one: guest?.plus_one ?? false,
        plus_one_name: guest?.plus_one_name ?? '',
        notes: guest?.notes ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: onClose };
        if (guest) {
            form.patch(GuestController.update.url(guest.id), opts);
        } else {
            form.post(GuestController.store.url(), opts);
        }
    };

    return (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>
                            {guest ? 'Edit guest' : 'Add guest'}
                        </DialogTitle>
                        <DialogDescription>
                            Invitation and RSVP details.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Side</Label>
                            <Select
                                value={form.data.side}
                                onValueChange={(v) => form.setData('side', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {sideOptions.map((o) => (
                                        <SelectItem key={o.value} value={o.value}>
                                            {o.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="group">Group</Label>
                            <Input
                                id="group"
                                placeholder="Family, Friends…"
                                value={form.data.group}
                                onChange={(e) =>
                                    form.setData('group', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={form.data.phone}
                                onChange={(e) =>
                                    form.setData('phone', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.data.email}
                                onChange={(e) =>
                                    form.setData('email', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>RSVP</Label>
                            <Select
                                value={form.data.rsvp_status}
                                onValueChange={(v) =>
                                    form.setData('rsvp_status', v)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {rsvpOptions.map((o) => (
                                        <SelectItem key={o.value} value={o.value}>
                                            {o.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-end gap-4">
                            <label className="flex items-center gap-2 text-sm">
                                <Checkbox
                                    checked={form.data.invited}
                                    onCheckedChange={(c) =>
                                        form.setData('invited', c === true)
                                    }
                                />
                                Invited
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <Checkbox
                                    checked={form.data.plus_one}
                                    onCheckedChange={(c) =>
                                        form.setData('plus_one', c === true)
                                    }
                                />
                                Plus-one
                            </label>
                        </div>
                    </div>

                    {form.data.plus_one && (
                        <div className="grid gap-2">
                            <Label htmlFor="plus_one_name">Plus-one name</Label>
                            <Input
                                id="plus_one_name"
                                value={form.data.plus_one_name}
                                onChange={(e) =>
                                    form.setData('plus_one_name', e.target.value)
                                }
                            />
                        </div>
                    )}

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
                            {guest ? 'Save' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

GuestsPage.layout = {
    breadcrumbs: [{ title: 'Guests', href: guestsRoute() }],
};
