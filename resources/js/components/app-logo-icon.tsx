import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="11" r="3.6" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <line x1="12" y1="2.4" x2="12" y2="4.6" />
                <line x1="5.1" y1="4.1" x2="6.7" y2="5.7" />
                <line x1="18.9" y1="4.1" x2="17.3" y2="5.7" />
                <line x1="2.6" y1="11" x2="4.8" y2="11" />
                <line x1="21.4" y1="11" x2="19.2" y2="11" />
                <line x1="3.5" y1="17.6" x2="20.5" y2="17.6" strokeWidth="1.8" />
                <line x1="7.5" y1="21.4" x2="16.5" y2="21.4" strokeWidth="1.8" />
            </g>
        </svg>
    );
}
