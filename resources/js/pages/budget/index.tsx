import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Pencil, Plus, Receipt, Sparkles, Trash2 } from 'lucide-react';
import BudgetItemController from '@/actions/App/Http/Controllers/BudgetItemController';
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
import { Progress } from '@/components/ui/progress';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { summarizeBudget } from '@/lib/budget';
import { formatPeso, pesoInputValue } from '@/lib/currency';
import { advisor as generateAdvice, index as budget } from '@/routes/budget';
import { store as storePayment, destroy as destroyPayment } from '@/routes/payments';
import type {
    BudgetItem,
    BudgetSummary,
    Category,
    Option,
    Wedding,
} from '@/types/wedding';

const NONE = 'none';

type Props = {
    wedding: Wedding;
    items: BudgetItem[];
    summary: BudgetSummary;
    categories: Category[];
    vendors: { id: number; name: string }[];
    statusOptions: Option[];
    ai: { enabled: boolean; summary: string | null; generatedAt: string | null };
};

const effective = (i: BudgetItem) => i.actual_amount ?? i.estimated_amount;

function toPayload(item: BudgetItem, overrides: Partial<Record<string, unknown>>) {
    return {
        category_id: item.category_id,
        vendor_id: item.vendor_id,
        title: item.title,
        estimated_amount: pesoInputValue(item.estimated_amount),
        actual_amount: pesoInputValue(item.actual_amount),
        status: item.status,
        due_date: item.due_date,
        notes: item.notes,
        ...overrides,
    };
}

export default function BudgetPage({
    wedding,
    items,
    summary,
    categories,
    vendors,
    statusOptions,
    ai,
}: Props) {
    const [editing, setEditing] = useState<BudgetItem | null>(null);
    const [creating, setCreating] = useState(false);
    const [payingFor, setPayingFor] = useState<BudgetItem | null>(null);
    const [advising, setAdvising] = useState(false);

    // Live what-if recompute (overlays server summary while toggling).
    const liveSummary = useMemo(
        () =>
            summarizeBudget(
                items.map((i) => ({
                    estimated_amount: i.estimated_amount,
                    actual_amount: i.actual_amount,
                    status: i.status,
                    paid: i.paid,
                })),
                summary.ceiling,
            ),
        [items, summary.ceiling],
    );

    const catName = (id: number | null) =>
        categories.find((c) => c.id === id)?.name ?? 'Uncategorized';

    // Group items by category, categories in order then uncategorized.
    const groups = useMemo(() => {
        const order = [...categories.map((c) => c.id), null];
        const byId = new Map<number | null, BudgetItem[]>();
        for (const item of items) {
            const key = categories.some((c) => c.id === item.category_id)
                ? item.category_id
                : null;
            byId.set(key, [...(byId.get(key) ?? []), item]);
        }
        return order
            .filter((id) => byId.has(id))
            .map((id) => ({ id, name: catName(id), rows: byId.get(id)! }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, categories]);

    const toggleStatus = (item: BudgetItem) => {
        const next = item.status === 'committed' ? 'considering' : 'committed';
        router.patch(
            BudgetItemController.update.url(item.id),
            toPayload(item, { status: next }),
            { preserveScroll: true, preserveState: false },
        );
    };

    const remove = (item: BudgetItem) => {
        if (confirm(`Remove "${item.title}"?`)) {
            router.delete(BudgetItemController.destroy.url(item.id), {
                preserveScroll: true,
            });
        }
    };

    const pct =
        liveSummary.ceiling && liveSummary.ceiling > 0
            ? Math.min(
                  100,
                  Math.round(
                      (liveSummary.actualTotal / liveSummary.ceiling) * 100,
                  ),
              )
            : 0;
    const projectedPct =
        liveSummary.ceiling && liveSummary.ceiling > 0
            ? Math.min(
                  100,
                  Math.round(
                      (liveSummary.projectedTotal / liveSummary.ceiling) * 100,
                  ),
              )
            : 0;

    return (
        <>
            <Head title="Budget" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Budget
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Your running cost spreadsheet and what-if calculator.
                        </p>
                    </div>
                    <Button onClick={() => setCreating(true)}>
                        <Plus /> Add item
                    </Button>
                </div>

                {/* Summary */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryTile
                        label="Planned"
                        value={formatPeso(liveSummary.plannedTotal)}
                        hint="committed estimates"
                    />
                    <SummaryTile
                        label="Actual"
                        value={formatPeso(liveSummary.actualTotal)}
                        hint="final/best-known cost"
                    />
                    <SummaryTile
                        label="Paid"
                        value={formatPeso(liveSummary.paidTotal)}
                        hint={`${formatPeso(liveSummary.remainingTotal)} remaining`}
                    />
                    <SummaryTile
                        label="Projected (+ what-ifs)"
                        value={formatPeso(liveSummary.projectedTotal)}
                        hint={`${formatPeso(liveSummary.consideringTotal)} considering`}
                        accent
                    />
                </div>

                {/* Ceiling bar */}
                <Card>
                    <CardContent className="space-y-3 pt-6">
                        {liveSummary.ceiling !== null ? (
                            <>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Budget ceiling {formatPeso(liveSummary.ceiling)}
                                    </span>
                                    <span
                                        className={
                                            (liveSummary.variance ?? 0) < 0
                                                ? 'font-medium text-destructive'
                                                : 'font-medium text-muted-foreground'
                                        }
                                    >
                                        {(liveSummary.variance ?? 0) < 0
                                            ? `Over by ${formatPeso(Math.abs(liveSummary.variance ?? 0))}`
                                            : `${formatPeso(liveSummary.variance ?? 0)} left`}
                                    </span>
                                </div>
                                <Progress value={pct} />
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Actual uses {pct}%</span>
                                    <span>Projected uses {projectedPct}%</span>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Set a budget ceiling in{' '}
                                <a
                                    href="/settings/wedding"
                                    className="underline underline-offset-4"
                                >
                                    wedding settings
                                </a>{' '}
                                to track variance.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Spreadsheet */}
                <Card>
                    <CardContent className="pt-6">
                        {items.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No budget items yet. Add your first line item to
                                start tracking.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead className="text-right">
                                            Estimated
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Actual
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Paid
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Remaining
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {groups.map((group) => {
                                        const committed = group.rows.filter(
                                            (r) => r.status === 'committed',
                                        );
                                        const subActual = committed.reduce(
                                            (s, r) => s + effective(r),
                                            0,
                                        );
                                        const subPaid = committed.reduce(
                                            (s, r) => s + r.paid,
                                            0,
                                        );
                                        return (
                                            <GroupRows
                                                key={group.id ?? 'none'}
                                                name={group.name}
                                                rows={group.rows}
                                                subActual={subActual}
                                                subPaid={subPaid}
                                                onEdit={setEditing}
                                                onPay={setPayingFor}
                                                onToggle={toggleStatus}
                                                onRemove={remove}
                                            />
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Budget Advisor (AI) */}
                <Card>
                    <CardHeader className="flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Sparkles className="size-4 text-primary" /> Budget
                            Advisor
                        </CardTitle>
                        {ai.enabled && (
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={advising}
                                onClick={() => {
                                    setAdvising(true);
                                    router.post(
                                        generateAdvice.url(),
                                        {},
                                        {
                                            preserveScroll: true,
                                            onFinish: () => setAdvising(false),
                                        },
                                    );
                                }}
                            >
                                {advising
                                    ? 'Thinking…'
                                    : ai.summary
                                      ? 'Regenerate'
                                      : 'Get AI advice'}
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        {!ai.enabled ? (
                            <p className="text-sm text-muted-foreground">
                                Add an <code>ANTHROPIC_API_KEY</code> to your{' '}
                                <code>.env</code> to get tailored suggestions on
                                where you're over or under typical allocations and
                                what to trim.
                            </p>
                        ) : ai.summary ? (
                            <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                                {ai.summary}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Click “Get AI advice” for suggestions based on your
                                current budget.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {(creating || editing) && (
                <ItemDialog
                    item={editing}
                    categories={categories}
                    vendors={vendors}
                    statusOptions={statusOptions}
                    onClose={() => {
                        setCreating(false);
                        setEditing(null);
                    }}
                />
            )}

            {payingFor && (
                <PaymentsSheet
                    item={payingFor}
                    onClose={() => setPayingFor(null)}
                />
            )}
        </>
    );
}

function SummaryTile({
    label,
    value,
    hint,
    accent,
}: {
    label: string;
    value: string;
    hint?: string;
    accent?: boolean;
}) {
    return (
        <Card className={accent ? 'border-primary/40' : undefined}>
            <CardContent className="pt-6">
                <p className="text-xs font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
                {hint && (
                    <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
                )}
            </CardContent>
        </Card>
    );
}

function GroupRows({
    name,
    rows,
    subActual,
    subPaid,
    onEdit,
    onPay,
    onToggle,
    onRemove,
}: {
    name: string;
    rows: BudgetItem[];
    subActual: number;
    subPaid: number;
    onEdit: (i: BudgetItem) => void;
    onPay: (i: BudgetItem) => void;
    onToggle: (i: BudgetItem) => void;
    onRemove: (i: BudgetItem) => void;
}) {
    return (
        <>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableCell colSpan={8} className="py-1.5 text-xs font-semibold tracking-wide uppercase text-muted-foreground">
                    {name}
                    <span className="ml-2 font-normal normal-case">
                        · committed {formatPeso(subActual)} ({formatPeso(subPaid)}{' '}
                        paid)
                    </span>
                </TableCell>
            </TableRow>
            {rows.map((row) => {
                const considering = row.status === 'considering';
                const actual = row.actual_amount ?? row.estimated_amount;
                return (
                    <TableRow
                        key={row.id}
                        className={considering ? 'opacity-70' : undefined}
                    >
                        <TableCell className="font-medium">
                            {row.title}
                            {row.due_date && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                    due{' '}
                                    {new Date(row.due_date).toLocaleDateString(
                                        'en-PH',
                                        { month: 'short', day: 'numeric' },
                                    )}
                                </span>
                            )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                            {row.vendor?.name ?? '—'}
                        </TableCell>
                        <TableCell className="text-right">
                            {formatPeso(row.estimated_amount)}
                        </TableCell>
                        <TableCell className="text-right">
                            {row.actual_amount !== null
                                ? formatPeso(row.actual_amount)
                                : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                            {formatPeso(row.paid)}
                        </TableCell>
                        <TableCell className="text-right">
                            {formatPeso(Math.max(0, actual - row.paid))}
                        </TableCell>
                        <TableCell>
                            <button type="button" onClick={() => onToggle(row)}>
                                <Badge
                                    variant={considering ? 'outline' : 'secondary'}
                                    className="cursor-pointer"
                                >
                                    {considering ? 'Considering' : 'Committed'}
                                </Badge>
                            </button>
                        </TableCell>
                        <TableCell>
                            <div className="flex justify-end gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onPay(row)}
                                    title="Payments"
                                >
                                    <Receipt className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onEdit(row)}
                                    title="Edit"
                                >
                                    <Pencil className="size-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => onRemove(row)}
                                    title="Remove"
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                );
            })}
        </>
    );
}

function ItemDialog({
    item,
    categories,
    vendors,
    statusOptions,
    onClose,
}: {
    item: BudgetItem | null;
    categories: Category[];
    vendors: { id: number; name: string }[];
    statusOptions: Option[];
    onClose: () => void;
}) {
    const form = useForm({
        category_id: item?.category_id ? String(item.category_id) : NONE,
        vendor_id: item?.vendor_id ? String(item.vendor_id) : NONE,
        title: item?.title ?? '',
        estimated_amount: pesoInputValue(item?.estimated_amount ?? 0),
        actual_amount: pesoInputValue(item?.actual_amount),
        status: item?.status ?? 'committed',
        due_date: item?.due_date ?? '',
        notes: item?.notes ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.transform((data) => ({
            ...data,
            category_id: data.category_id === NONE ? null : data.category_id,
            vendor_id: data.vendor_id === NONE ? null : data.vendor_id,
        }));
        const opts = { preserveScroll: true, onSuccess: onClose };
        if (item) {
            form.patch(BudgetItemController.update.url(item.id), opts);
        } else {
            form.post(BudgetItemController.store.url(), opts);
        }
    };

    return (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>
                            {item ? 'Edit item' : 'Add budget item'}
                        </DialogTitle>
                        <DialogDescription>
                            Track estimated vs actual cost and link a vendor.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-2">
                        <Label htmlFor="title">Item</Label>
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
                            <Label>Category</Label>
                            <Select
                                value={form.data.category_id}
                                onValueChange={(v) => form.setData('category_id', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={NONE}>Uncategorized</SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={String(c.id)}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select
                                value={form.data.status}
                                onValueChange={(v) => form.setData('status', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((o) => (
                                        <SelectItem key={o.value} value={o.value}>
                                            {o.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="estimated_amount">Estimated (₱)</Label>
                            <Input
                                id="estimated_amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.data.estimated_amount}
                                onChange={(e) =>
                                    form.setData('estimated_amount', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="actual_amount">Actual (₱)</Label>
                            <Input
                                id="actual_amount"
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="once finalized"
                                value={form.data.actual_amount}
                                onChange={(e) =>
                                    form.setData('actual_amount', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
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
                            value={form.data.notes ?? ''}
                            onChange={(e) => form.setData('notes', e.target.value)}
                        />
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {item ? 'Save' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function PaymentsSheet({
    item,
    onClose,
}: {
    item: BudgetItem;
    onClose: () => void;
}) {
    const form = useForm({
        amount: '',
        paid_on: new Date().toISOString().slice(0, 10),
        method: '',
        note: '',
    });

    const add = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(storePayment.url(item.id), {
            preserveScroll: true,
            onSuccess: () => form.reset('amount', 'method', 'note'),
        });
    };

    const totalPaid = item.payments.reduce((s, p) => s + p.amount, 0);

    return (
        <Sheet open onOpenChange={(o) => !o && onClose()}>
            <SheetContent className="flex w-full flex-col gap-4 overflow-y-auto sm:max-w-md">
                <SheetHeader>
                    <SheetTitle>Payments · {item.title}</SheetTitle>
                    <SheetDescription>
                        {formatPeso(totalPaid)} paid of{' '}
                        {formatPeso(item.actual_amount ?? item.estimated_amount)}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-2 px-4">
                    {item.payments.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No payments recorded yet.
                        </p>
                    )}
                    {item.payments.map((p) => (
                        <div
                            key={p.id}
                            className="flex items-center justify-between rounded-md border p-2 text-sm"
                        >
                            <div>
                                <div className="font-medium">
                                    {formatPeso(p.amount)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {new Date(p.paid_on).toLocaleDateString('en-PH')}
                                    {p.method ? ` · ${p.method}` : ''}
                                    {p.note ? ` · ${p.note}` : ''}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    router.delete(destroyPayment.url(p.id), {
                                        preserveScroll: true,
                                    })
                                }
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <form onSubmit={add} className="space-y-3 border-t px-4 pt-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                            <Label htmlFor="amount">Amount (₱)</Label>
                            <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.data.amount}
                                onChange={(e) =>
                                    form.setData('amount', e.target.value)
                                }
                                required
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="paid_on">Date</Label>
                            <Input
                                id="paid_on"
                                type="date"
                                value={form.data.paid_on}
                                onChange={(e) =>
                                    form.setData('paid_on', e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-1.5">
                            <Label htmlFor="method">Method</Label>
                            <Input
                                id="method"
                                placeholder="GCash, Cash…"
                                value={form.data.method}
                                onChange={(e) =>
                                    form.setData('method', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="note">Note</Label>
                            <Input
                                id="note"
                                value={form.data.note}
                                onChange={(e) =>
                                    form.setData('note', e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={form.processing}
                    >
                        <Plus /> Record payment
                    </Button>
                </form>
            </SheetContent>
        </Sheet>
    );
}

BudgetPage.layout = {
    breadcrumbs: [{ title: 'Budget', href: budget() }],
};
