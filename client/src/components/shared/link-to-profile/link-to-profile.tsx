import React from 'react';
import { Link } from 'react-router-dom';
import { Companion } from '../../../types/messenger';

interface Props {
    userOrUsername: Companion | string | undefined | null;
    className?: string;
    children: React.ReactNode;
}

export function LinkToProfile({ userOrUsername, className, children }: Props) {
    const username = typeof userOrUsername === 'string'
        ? userOrUsername
        : userOrUsername?.username ?? userOrUsername?.publicId;

    if (!userOrUsername) return <div className={className}>{children}</div>

    return (
        <Link to={`/${username}`} className={className}>
            {children}
        </Link>
    )
}