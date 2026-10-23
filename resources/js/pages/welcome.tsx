import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { register } from '@/routes';

export default function Welcome() {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 font-medium">
                                Let's get started
                            </h1>
                            <p className="mb-2 text-[#706f6c] dark:text-[#A1A09A]">
                                Laravel has an incredibly rich ecosystem.
                                <br />
                                We suggest starting with the following.
                            </p>
                            <ul className="mb-4 flex flex-col lg:mb-6">
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                        </span>
                                    </span>
                                    <span>
                                        Read the
                                        <a
                                            href="https://laravel.com/docs"
                                            target="_blank"
                                            className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                        >
                                            <span>Documentation</span>
                                            <svg
                                                width={10}
                                                height={11}
                                                viewBox="0 0 10 11"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-2.5 w-2.5"
                                            >
                                                <path
                                                    d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                                                    stroke="currentColor"
                                                    strokeLinecap="square"
                                                />
                                            </svg>
                                        </a>
                                    </span>
                                </li>
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <span className="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]" />
                                        </span>
                                    </span>
                                    <span>
                                        Watch video tutorials at
                                        <a
                                            href="https://laracasts.com"
                                            target="_blank"
                                            className="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                        >
                                            <span>Laracasts</span>
                                            <svg
                                                width={10}
                                                height={11}
                                                viewBox="0 0 10 11"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-2.5 w-2.5"
                                            >
                                                <path
                                                    d="M7.70833 6.95834V2.79167H3.54167M2.5 8L7.5 3.00001"
                                                    stroke="currentColor"
                                                    strokeLinecap="square"
                                                />
                                            </svg>
                                        </a>
                                    </span>
                                </li>
                            </ul>
                            <ul className="flex gap-3 text-sm leading-normal">
                                <li>
                                    <a
                                        href="https://cloud.laravel.com"
                                        target="_blank"
                                        className="inline-block rounded-sm border border-black bg-[#1b1b18] px-5 py-1.5 text-sm leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                    >
                                        Deploy now
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="relative -mb-px flex aspect-[335/364] w-full shrink-0 items-center justify-center overflow-hidden rounded-t-lg bg-gradient-to-b from-[#f6c45f] via-[#e27b5a] to-[#6e3f73] lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[438px] lg:rounded-t-none lg:rounded-r-lg dark:from-[#8a5a2a] dark:via-[#7a3350] dark:to-[#2a1b3e]">
                            <div className="flex flex-col items-center gap-6 px-8 py-16 text-center opacity-100 transition-all duration-750 starting:opacity-0 motion-safe:starting:translate-y-6">
                                <svg
                                    viewBox="0 0 64 64"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-28 w-28 drop-shadow-sm"
                                >
                                    <g stroke="#fff3e2" strokeWidth="3.4" strokeLinecap="round">
                                        <line x1="32" y1="9" x2="32" y2="15" />
                                        <line x1="16.4" y1="13.4" x2="20.1" y2="17.1" />
                                        <line x1="47.6" y1="13.4" x2="43.9" y2="17.1" />
                                        <line x1="9" y1="29" x2="15" y2="29" />
                                        <line x1="55" y1="29" x2="49" y2="29" />
                                    </g>
                                    <circle cx="32" cy="29" r="9.5" fill="#fff3e2" />
                                    <g stroke="#fff3e2" strokeWidth="3.4" strokeLinecap="round">
                                        <line x1="12" y1="45" x2="52" y2="45" />
                                        <line x1="20" y1="53" x2="44" y2="53" />
                                    </g>
                                </svg>
                                <div className="flex flex-col gap-1">
                                    <span className="text-2xl font-semibold tracking-tight text-[#fff3e2]">
                                        Happily Planned
                                    </span>
                                    <span className="text-sm text-[#fff3e2]/80">
                                        Dapit Hapon
                                    </span>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(255,255,255,0.18)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_rgba(255,255,255,0.12)]"></div>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
