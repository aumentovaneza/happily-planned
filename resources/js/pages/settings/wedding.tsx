import { Form, Head } from '@inertiajs/react';
import WeddingController from '@/actions/App/Http/Controllers/Settings/WeddingController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { pesoInputValue } from '@/lib/currency';
import { edit } from '@/routes/wedding';
import type { Wedding } from '@/types/wedding';

export default function WeddingSettings({ wedding }: { wedding: Wedding }) {
    return (
        <>
            <Head title="Wedding details" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Wedding details"
                    description="Your names, date, budget ceiling and currency. These power the dashboard countdown and budget variance."
                />

                <Form
                    {...WeddingController.update.form()}
                    options={{ preserveScroll: true }}
                    className="space-y-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="partner_one_name">Partner 1</Label>
                                    <Input
                                        id="partner_one_name"
                                        name="partner_one_name"
                                        defaultValue={wedding.partner_one_name ?? ''}
                                        placeholder="e.g. Vaneza"
                                    />
                                    <InputError message={errors.partner_one_name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="partner_two_name">Partner 2</Label>
                                    <Input
                                        id="partner_two_name"
                                        name="partner_two_name"
                                        defaultValue={wedding.partner_two_name ?? ''}
                                        placeholder="e.g. Jennesee"
                                    />
                                    <InputError message={errors.partner_two_name} />
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="wedding_date">Wedding date</Label>
                                    <Input
                                        id="wedding_date"
                                        name="wedding_date"
                                        type="date"
                                        defaultValue={wedding.wedding_date ?? ''}
                                    />
                                    <InputError message={errors.wedding_date} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="currency">Currency</Label>
                                    <Input
                                        id="currency"
                                        name="currency"
                                        defaultValue={wedding.currency}
                                        maxLength={3}
                                        className="uppercase"
                                    />
                                    <InputError message={errors.currency} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="budget_ceiling">
                                    Overall budget ceiling (₱)
                                </Label>
                                <Input
                                    id="budget_ceiling"
                                    name="budget_ceiling"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    defaultValue={pesoInputValue(wedding.budget_ceiling)}
                                    placeholder="e.g. 500000"
                                />
                                <InputError message={errors.budget_ceiling} />
                            </div>

                            <Button disabled={processing}>Save</Button>
                        </>
                    )}
                </Form>
            </div>
        </>
    );
}

WeddingSettings.layout = {
    breadcrumbs: [{ title: 'Wedding details', href: edit() }],
};
