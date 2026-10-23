import { Head, router, useForm } from '@inertiajs/react';
import { useMemo } from 'react';
import { Sparkles, Wine } from 'lucide-react';
import { useState } from 'react';
import DrinksController from '@/actions/App/Http/Controllers/DrinksController';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { computeDrinks } from '@/lib/drinks';
import { index as drinksRoute } from '@/routes/drinks';
import type { DrinkPlan } from '@/types/wedding';

type Props = {
    plan: DrinkPlan;
    confirmedHeadcount: number;
    ai: { enabled: boolean; tip: string | null; generatedAt: string | null };
};

export default function DrinksPage({ plan, confirmedHeadcount, ai }: Props) {
    const [tipLoading, setTipLoading] = useState(false);
    const form = useForm({
        guest_count: plan.guest_count !== null ? String(plan.guest_count) : '',
        duration_hours: String(plan.duration_hours),
        event_type: plan.event_type,
        mix: { ...plan.mix },
        include_toast: plan.include_toast,
        notes: plan.notes ?? '',
    });

    const guests = Number(form.data.guest_count) || confirmedHeadcount;
    const hours = Number(form.data.duration_hours) || 0;
    const mixTotal =
        form.data.mix.beer +
        form.data.mix.wine +
        form.data.mix.spirits +
        form.data.mix.non_alcoholic;

    const result = useMemo(
        () =>
            computeDrinks({
                guests,
                hours,
                mix: form.data.mix,
                includeToast: form.data.include_toast,
            }),
        [guests, hours, form.data.mix, form.data.include_toast],
    );

    const setMix = (key: keyof DrinkPlan['mix'], value: number) =>
        form.setData('mix', { ...form.data.mix, [key]: value });

    const save = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch(DrinksController.update.url(), { preserveScroll: true });
    };

    return (
        <>
            <Head title="Drinks calculator" />
            <div className="flex flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Drinks calculator
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Estimate how much to buy from your guest count and drink mix.
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Inputs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Your reception</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={save} className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="guest_count">
                                            Guests
                                        </Label>
                                        <Input
                                            id="guest_count"
                                            type="number"
                                            min="0"
                                            placeholder={`${confirmedHeadcount} confirmed`}
                                            value={form.data.guest_count}
                                            onChange={(e) =>
                                                form.setData(
                                                    'guest_count',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Blank = {confirmedHeadcount} confirmed
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="duration_hours">
                                            Hours
                                        </Label>
                                        <Input
                                            id="duration_hours"
                                            type="number"
                                            min="1"
                                            max="24"
                                            value={form.data.duration_hours}
                                            onChange={(e) =>
                                                form.setData(
                                                    'duration_hours',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="event_type">Event type</Label>
                                    <Input
                                        id="event_type"
                                        value={form.data.event_type}
                                        onChange={(e) =>
                                            form.setData(
                                                'event_type',
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Drink mix (%)</Label>
                                        <span
                                            className={
                                                mixTotal !== 100
                                                    ? 'text-xs font-medium text-destructive'
                                                    : 'text-xs text-muted-foreground'
                                            }
                                        >
                                            totals {mixTotal}%
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {(
                                            [
                                                ['beer', 'Beer'],
                                                ['wine', 'Wine'],
                                                ['spirits', 'Spirits'],
                                                ['non_alcoholic', 'Non-alcoholic'],
                                            ] as const
                                        ).map(([key, label]) => (
                                            <div key={key} className="grid gap-1.5">
                                                <Label
                                                    htmlFor={key}
                                                    className="text-xs"
                                                >
                                                    {label}
                                                </Label>
                                                <Input
                                                    id={key}
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={form.data.mix[key]}
                                                    onChange={(e) =>
                                                        setMix(
                                                            key,
                                                            Number(
                                                                e.target.value,
                                                            ) || 0,
                                                        )
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                        checked={form.data.include_toast}
                                        onCheckedChange={(c) =>
                                            form.setData('include_toast', c === true)
                                        }
                                    />
                                    Include a toast drink for everyone
                                </label>

                                <div className="grid gap-2">
                                    <Label htmlFor="notes">Notes</Label>
                                    <Textarea
                                        id="notes"
                                        value={form.data.notes}
                                        onChange={(e) =>
                                            form.setData('notes', e.target.value)
                                        }
                                    />
                                </div>

                                <Button type="submit" disabled={form.processing}>
                                    Save plan
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Results */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Wine className="size-4 text-primary" />
                                    Shopping estimate
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-muted-foreground">
                                    ~{result.totalDrinks} total drinks for {guests}{' '}
                                    guests over {hours} hour(s).
                                </p>
                                <ul className="space-y-2">
                                    {result.lines.map((line) => (
                                        <li
                                            key={line.label}
                                            className="flex items-start justify-between gap-4 border-b pb-2 text-sm last:border-0"
                                        >
                                            <span className="font-medium">
                                                {line.label}
                                            </span>
                                            <span className="text-right text-muted-foreground">
                                                {line.detail}
                                            </span>
                                        </li>
                                    ))}
                                    <li className="flex items-center justify-between text-sm">
                                        <span className="font-medium">Ice</span>
                                        <span className="text-muted-foreground">
                                            ≈ {result.iceKg} kg
                                        </span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex-row items-center justify-between space-y-0">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Sparkles className="size-4 text-primary" />
                                    AI serving tip
                                </CardTitle>
                                {ai.enabled && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={tipLoading}
                                        onClick={() => {
                                            setTipLoading(true);
                                            router.post(
                                                DrinksController.tip.url(),
                                                {},
                                                {
                                                    preserveScroll: true,
                                                    onFinish: () =>
                                                        setTipLoading(false),
                                                },
                                            );
                                        }}
                                    >
                                        {tipLoading
                                            ? 'Thinking…'
                                            : ai.tip
                                              ? 'Regenerate'
                                              : 'Get tip'}
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                {!ai.enabled ? (
                                    <p className="text-sm text-muted-foreground">
                                        Add an <code>ANTHROPIC_API_KEY</code> to your{' '}
                                        <code>.env</code> for an AI shopping &amp;
                                        serving tip. The estimate above works without
                                        it.
                                    </p>
                                ) : ai.tip ? (
                                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {ai.tip}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">
                                        Save your plan, then get a tailored tip.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

DrinksPage.layout = {
    breadcrumbs: [{ title: 'Drinks calculator', href: drinksRoute() }],
};
