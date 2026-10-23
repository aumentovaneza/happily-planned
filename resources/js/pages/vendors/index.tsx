import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    ExternalLink,
    Instagram,
    Mail,
    Pencil,
    Phone,
    Plus,
    Star,
    Trash2,
} from 'lucide-react';
import VendorController from '@/actions/App/Http/Controllers/VendorController';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { formatPeso, pesoInputValue } from '@/lib/currency';
import { index as vendorsRoute } from '@/routes/vendors';
import type { Category, Option, Vendor } from '@/types/wedding';

const NONE = 'none';
const ALL = 'all';

const statusVariant = (
    status: string,
): 'default' | 'secondary' | 'outline' | 'destructive' =>
    status === 'booked'
        ? 'default'
        : status === 'shortlisted'
          ? 'secondary'
          : status === 'rejected'
            ? 'destructive'
            : 'outline';

type Props = {
    vendors: Vendor[];
    categories: Category[];
    statusOptions: Option[];
};

export default function VendorsPage({
    vendors,
    categories,
    statusOptions,
}: Props) {
    const [tab, setTab] = useState(ALL);
    const [editing, setEditing] = useState<Vendor | null>(null);
    const [creating, setCreating] = useState(false);

    const filtered = useMemo(
        () =>
            tab === ALL
                ? vendors
                : vendors.filter((v) => String(v.category_id) === tab),
        [vendors, tab],
    );

    const remove = (v: Vendor) => {
        if (confirm(`Remove "${v.name}"?`)) {
            router.delete(VendorController.destroy.url(v.id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <>
            <Head title="Vendors" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Vendors
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Compare suppliers side by side with the info you've
                            gathered.
                        </p>
                    </div>
                    <Button onClick={() => setCreating(true)}>
                        <Plus /> Add vendor
                    </Button>
                </div>

                <Tabs value={tab} onValueChange={setTab}>
                    <TabsList className="flex-wrap">
                        <TabsTrigger value={ALL}>All</TabsTrigger>
                        {categories.map((c) => (
                            <TabsTrigger key={c.id} value={String(c.id)}>
                                {c.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                <Card>
                    <CardContent className="pt-6">
                        {filtered.length === 0 ? (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                No vendors here yet. Add one to start comparing.
                            </p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Quote
                                        </TableHead>
                                        <TableHead>Rating</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Pros / Cons</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filtered.map((v) => (
                                        <TableRow key={v.id} className="align-top">
                                            <TableCell className="font-medium">
                                                {v.name}
                                                {v.website && (
                                                    <a
                                                        href={v.website}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="ml-1 inline-flex text-muted-foreground hover:text-foreground"
                                                    >
                                                        <ExternalLink className="inline size-3" />
                                                    </a>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {v.category ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={statusVariant(v.status)}>
                                                    {v.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {v.quoted_price !== null
                                                    ? formatPeso(v.quoted_price)
                                                    : '—'}
                                            </TableCell>
                                            <TableCell>
                                                {v.rating ? (
                                                    <span className="inline-flex items-center gap-0.5">
                                                        {v.rating}
                                                        <Star className="size-3 fill-chart-1 text-chart-1" />
                                                    </span>
                                                ) : (
                                                    '—'
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                <div className="flex flex-col gap-0.5 text-xs">
                                                    {v.phone && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Phone className="size-3" />
                                                            {v.phone}
                                                        </span>
                                                    )}
                                                    {v.email && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Mail className="size-3" />
                                                            {v.email}
                                                        </span>
                                                    )}
                                                    {v.instagram && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Instagram className="size-3" />
                                                            {v.instagram}
                                                        </span>
                                                    )}
                                                    {!v.phone &&
                                                        !v.email &&
                                                        !v.instagram &&
                                                        '—'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs text-xs whitespace-normal text-muted-foreground">
                                                {v.pros && (
                                                    <div>
                                                        <span className="font-medium text-foreground">
                                                            +
                                                        </span>
                                                        {v.pros}
                                                    </div>
                                                )}
                                                {v.cons && (
                                                    <div>
                                                        <span className="font-medium text-foreground">
                                                            −
                                                        </span>
                                                        {v.cons}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex justify-end gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setEditing(v)}
                                                    >
                                                        <Pencil className="size-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => remove(v)}
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
                <VendorDialog
                    vendor={editing}
                    categories={categories}
                    statusOptions={statusOptions}
                    onClose={() => {
                        setCreating(false);
                        setEditing(null);
                    }}
                />
            )}
        </>
    );
}

function VendorDialog({
    vendor,
    categories,
    statusOptions,
    onClose,
}: {
    vendor: Vendor | null;
    categories: Category[];
    statusOptions: Option[];
    onClose: () => void;
}) {
    const form = useForm({
        category_id: vendor?.category_id ? String(vendor.category_id) : NONE,
        name: vendor?.name ?? '',
        status: vendor?.status ?? 'considering',
        quoted_price: pesoInputValue(vendor?.quoted_price),
        rating: vendor?.rating ? String(vendor.rating) : NONE,
        phone: vendor?.phone ?? '',
        email: vendor?.email ?? '',
        website: vendor?.website ?? '',
        instagram: vendor?.instagram ?? '',
        pros: vendor?.pros ?? '',
        cons: vendor?.cons ?? '',
        notes: vendor?.notes ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.transform((data) => ({
            ...data,
            category_id: data.category_id === NONE ? null : data.category_id,
            rating: data.rating === NONE ? null : data.rating,
        }));
        const opts = { preserveScroll: true, onSuccess: onClose };
        if (vendor) {
            form.patch(VendorController.update.url(vendor.id), opts);
        } else {
            form.post(VendorController.store.url(), opts);
        }
    };

    return (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>
                            {vendor ? 'Edit vendor' : 'Add vendor'}
                        </DialogTitle>
                        <DialogDescription>
                            Store quotes and notes so you can compare later.
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
                            <Label htmlFor="quoted_price">Quoted price (₱)</Label>
                            <Input
                                id="quoted_price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.data.quoted_price}
                                onChange={(e) =>
                                    form.setData('quoted_price', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Rating</Label>
                            <Select
                                value={form.data.rating}
                                onValueChange={(v) => form.setData('rating', v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="—" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={NONE}>No rating</SelectItem>
                                    {[1, 2, 3, 4, 5].map((n) => (
                                        <SelectItem key={n} value={String(n)}>
                                            {n} / 5
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                        <div className="grid gap-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                placeholder="https://"
                                value={form.data.website}
                                onChange={(e) =>
                                    form.setData('website', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="instagram">Instagram</Label>
                            <Input
                                id="instagram"
                                placeholder="@handle"
                                value={form.data.instagram}
                                onChange={(e) =>
                                    form.setData('instagram', e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="pros">Pros</Label>
                            <Textarea
                                id="pros"
                                value={form.data.pros}
                                onChange={(e) =>
                                    form.setData('pros', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="cons">Cons</Label>
                            <Textarea
                                id="cons"
                                value={form.data.cons}
                                onChange={(e) =>
                                    form.setData('cons', e.target.value)
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
                            {vendor ? 'Save' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

VendorsPage.layout = {
    breadcrumbs: [{ title: 'Vendors', href: vendorsRoute() }],
};
