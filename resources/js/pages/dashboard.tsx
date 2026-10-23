import { Head, Link } from '@inertiajs/react';
import {
    CalendarHeart,
    ListChecks,
    Sparkles,
    Store,
    Users,
    Wallet,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatPeso } from '@/lib/currency';
import { dashboard } from '@/routes';
import { index as budget } from '@/routes/budget';
import { index as checklist } from '@/routes/checklist';
import { index as guests } from '@/routes/guests';
import { index as vendors } from '@/routes/vendors';
import { edit as weddingSettings } from '@/routes/wedding';
import type { BudgetSummary, Wedding } from '@/types/wedding';

type Props = {
    wedding: Wedding;
    daysUntil: number | null;
    budget: BudgetSummary;
    vendors: { total: number; booked: number };
    checklist: { total: number; done: number; percent: number };
    guests: {
        total: number;
        confirmed: number;
        pending: number;
        headcount: number;
    };
};

export default function Dashboard({
    wedding,
    daysUntil,
    budget: budgetSummary,
    vendors: vendorStats,
    checklist: checklistStats,
    guests: guestStats,
}: Props) {
    const names =
        wedding.partner_one_name && wedding.partner_two_name
            ? `${wedding.partner_one_name} & ${wedding.partner_two_name}`
            : 'Your wedding';

    const overBudget =
        budgetSummary.variance !== null && budgetSummary.variance < 0;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">{names}</h1>
                    <p className="text-sm text-muted-foreground">
                        {wedding.wedding_date
                            ? new Date(wedding.wedding_date).toLocaleDateString(
                                  'en-PH',
                                  { dateStyle: 'full' },
                              )
                            : (
                                  <Link
                                      href={weddingSettings()}
                                      className="underline underline-offset-4"
                                  >
                                      Set your wedding date
                                  </Link>
                              )}
                    </p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {/* Countdown */}
                    <Card>
                        <CardHeader className="flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Days until wedding
                            </CardTitle>
                            <CalendarHeart className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {daysUntil === null
                                    ? '—'
                                    : daysUntil >= 0
                                      ? daysUntil
                                      : 'Married! 🎉'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {daysUntil !== null && daysUntil >= 0
                                    ? 'to go'
                                    : daysUntil === null
                                      ? 'date not set'
                                      : ''}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Budget */}
                    <Link href={budget()} className="block">
                        <Card className="h-full transition-colors hover:border-primary/50">
                            <CardHeader className="flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Spent vs planned
                                </CardTitle>
                                <Wallet className="size-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatPeso(budgetSummary.actualTotal)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    planned {formatPeso(budgetSummary.plannedTotal)}
                                    {' · '}
                                    paid {formatPeso(budgetSummary.paidTotal)}
                                </p>
                                {budgetSummary.ceiling !== null && (
                                    <p
                                        className={
                                            'mt-1 text-xs font-medium ' +
                                            (overBudget
                                                ? 'text-destructive'
                                                : 'text-muted-foreground')
                                        }
                                    >
                                        {overBudget ? 'Over by ' : 'Left: '}
                                        {formatPeso(
                                            Math.abs(budgetSummary.variance ?? 0),
                                        )}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Guests */}
                    <Link href={guests()} className="block">
                        <Card className="h-full transition-colors hover:border-primary/50">
                            <CardHeader className="flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Guests attending
                                </CardTitle>
                                <Users className="size-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {guestStats.headcount}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {guestStats.confirmed} confirmed ·{' '}
                                    {guestStats.pending} pending · {guestStats.total}{' '}
                                    invited
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* Vendors */}
                    <Link href={vendors()} className="block">
                        <Card className="h-full transition-colors hover:border-primary/50">
                            <CardHeader className="flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    Vendors
                                </CardTitle>
                                <Store className="size-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {vendorStats.booked}
                                    <span className="text-base font-normal text-muted-foreground">
                                        {' '}
                                        / {vendorStats.total}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    booked / tracked
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Checklist progress */}
                    <Link href={checklist()} className="block">
                        <Card className="h-full transition-colors hover:border-primary/50">
                            <CardHeader className="flex-row items-center justify-between space-y-0">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <ListChecks className="size-4 text-primary" />
                                    Checklist
                                </CardTitle>
                                <span className="text-sm font-medium">
                                    {checklistStats.done}/{checklistStats.total}
                                </span>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Progress value={checklistStats.percent} />
                                <p className="text-xs text-muted-foreground">
                                    {checklistStats.percent}% complete
                                </p>
                            </CardContent>
                        </Card>
                    </Link>

                    {/* What-if projection */}
                    <Card className="h-full">
                        <CardHeader className="flex-row items-center justify-between space-y-0">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Sparkles className="size-4 text-primary" />
                                Projected total (with what-ifs)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatPeso(budgetSummary.projectedTotal)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                includes{' '}
                                {formatPeso(budgetSummary.consideringTotal)} you're
                                still considering
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
