import { Link } from '@inertiajs/react';
import {
    Armchair,
    Clock,
    LayoutGrid,
    ListChecks,
    Sparkles,
    Store,
    Users,
    Wallet,
    Wine,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as budget } from '@/routes/budget';
import { index as checklist } from '@/routes/checklist';
import { index as drinks } from '@/routes/drinks';
import { index as guests } from '@/routes/guests';
import { index as inspiration } from '@/routes/inspiration';
import { index as seating } from '@/routes/seating';
import { index as timeline } from '@/routes/timeline';
import { index as vendors } from '@/routes/vendors';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
    { title: 'Budget', href: budget(), icon: Wallet },
    { title: 'Vendors', href: vendors(), icon: Store },
    { title: 'Inspiration', href: inspiration(), icon: Sparkles },
    { title: 'Guests', href: guests(), icon: Users },
    { title: 'Seating', href: seating(), icon: Armchair },
    { title: 'Checklist', href: checklist(), icon: ListChecks },
    { title: 'Timeline', href: timeline(), icon: Clock },
    { title: 'Drinks', href: drinks(), icon: Wine },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
