import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    ExternalLink,
    ImageIcon,
    Music,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import InspirationController from '@/actions/App/Http/Controllers/InspirationController';
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
import { Textarea } from '@/components/ui/textarea';
import { index as inspirationRoute } from '@/routes/inspiration';
import type { Inspiration } from '@/types/wedding';

export default function InspirationPage({
    inspirations,
}: {
    inspirations: Inspiration[];
}) {
    const [editing, setEditing] = useState<Inspiration | null>(null);
    const [creating, setCreating] = useState(false);

    const groups = useMemo(() => {
        const map = new Map<string, Inspiration[]>();
        for (const item of inspirations) {
            const key = item.category?.trim() || 'Uncategorized';
            map.set(key, [...(map.get(key) ?? []), item]);
        }
        return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
    }, [inspirations]);

    const remove = (i: Inspiration) => {
        if (confirm(`Remove "${i.title}"?`)) {
            router.delete(InspirationController.destroy.url(i.id), {
                preserveScroll: true,
            });
        }
    };

    const host = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    // Returns the Spotify embed src for a share link, else null.
    const spotifyEmbed = (url: string): string | null => {
        try {
            const u = new URL(url);
            if (!u.hostname.endsWith('spotify.com')) return null;
            const m = u.pathname.match(
                /^\/(playlist|album|track|artist|episode|show)\/([A-Za-z0-9]+)/,
            );
            return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : null;
        } catch {
            return null;
        }
    };

    return (
        <>
            <Head title="Inspiration" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Inspiration
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Your Pinterest boards, TikTok / Instagram links, and
                            Spotify playlists, all in one place.
                        </p>
                    </div>
                    <Button onClick={() => setCreating(true)}>
                        <Plus /> Add link
                    </Button>
                </div>

                {inspirations.length === 0 ? (
                    <Card>
                        <CardContent className="py-10 text-center text-sm text-muted-foreground">
                            No inspiration saved yet. Paste a Pinterest board,
                            TikTok, Instagram, or Spotify playlist link to get
                            started.
                        </CardContent>
                    </Card>
                ) : (
                    groups.map(([category, items]) => (
                        <div key={category} className="space-y-3">
                            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                                {category}
                            </h2>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {items.map((item) => {
                                    const embed = spotifyEmbed(item.url);
                                    return (
                                        <Card
                                            key={item.id}
                                            className="overflow-hidden py-0"
                                        >
                                            {embed ? (
                                                <iframe
                                                    src={embed}
                                                    title={item.title}
                                                    loading="lazy"
                                                    className="w-full"
                                                    height={152}
                                                    style={{ border: 0 }}
                                                    allow="encrypted-media; clipboard-write; fullscreen; picture-in-picture"
                                                />
                                            ) : (
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="block aspect-video bg-muted"
                                                >
                                                    {item.thumbnail_url ? (
                                                        <img
                                                            src={
                                                                item.thumbnail_url
                                                            }
                                                            alt={item.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-muted-foreground">
                                                            <ImageIcon className="size-8" />
                                                        </div>
                                                    )}
                                                </a>
                                            )}
                                            <CardContent className="space-y-1 p-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <a
                                                        href={item.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="font-medium hover:underline"
                                                    >
                                                        {item.title}
                                                    </a>
                                                    <div className="flex shrink-0">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-7"
                                                            onClick={() =>
                                                                setEditing(item)
                                                            }
                                                        >
                                                            <Pencil className="size-3.5" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-7"
                                                            onClick={() =>
                                                                remove(item)
                                                            }
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className="gap-1"
                                                >
                                                    {embed ? (
                                                        <>
                                                            <Music className="size-3" />
                                                            Spotify
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ExternalLink className="size-3" />
                                                            {host(item.url)}
                                                        </>
                                                    )}
                                                </Badge>
                                                {item.notes && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.notes}
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {(creating || editing) && (
                <InspirationDialog
                    inspiration={editing}
                    onClose={() => {
                        setCreating(false);
                        setEditing(null);
                    }}
                />
            )}
        </>
    );
}

function InspirationDialog({
    inspiration,
    onClose,
}: {
    inspiration: Inspiration | null;
    onClose: () => void;
}) {
    const form = useForm({
        title: inspiration?.title ?? '',
        url: inspiration?.url ?? '',
        category: inspiration?.category ?? '',
        thumbnail_url: inspiration?.thumbnail_url ?? '',
        notes: inspiration?.notes ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: onClose };
        if (inspiration) {
            form.patch(InspirationController.update.url(inspiration.id), opts);
        } else {
            form.post(InspirationController.store.url(), opts);
        }
    };

    return (
        <Dialog open onOpenChange={(o) => !o && onClose()}>
            <DialogContent>
                <form onSubmit={submit} className="space-y-4">
                    <DialogHeader>
                        <DialogTitle>
                            {inspiration ? 'Edit link' : 'Add inspiration'}
                        </DialogTitle>
                        <DialogDescription>
                            Save a link and tag it so it's easy to find.
                        </DialogDescription>
                    </DialogHeader>

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
                    <div className="grid gap-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            placeholder="https://pinterest.com/… or a Spotify playlist link"
                            value={form.data.url}
                            onChange={(e) =>
                                form.setData('url', e.target.value)
                            }
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Paste a Spotify playlist link and it plays right
                            here. Log in to Spotify in this browser for
                            full-length tracks (otherwise you'll hear 30-second
                            previews).
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                placeholder="Flowers, Dress, Music…"
                                value={form.data.category}
                                onChange={(e) =>
                                    form.setData('category', e.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="thumbnail_url">
                                Thumbnail URL (optional)
                            </Label>
                            <Input
                                id="thumbnail_url"
                                placeholder="https://"
                                value={form.data.thumbnail_url}
                                onChange={(e) =>
                                    form.setData(
                                        'thumbnail_url',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                    </div>
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

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {inspiration ? 'Save' : 'Add'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

InspirationPage.layout = {
    breadcrumbs: [{ title: 'Inspiration', href: inspirationRoute() }],
};
