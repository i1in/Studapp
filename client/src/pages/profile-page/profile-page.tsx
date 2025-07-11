import { useGetProfileQuery } from '../../features/api/user/userApi';
import { useAppSelector } from '../../store/hooks';
import { useParams } from 'react-router-dom';
import { Logo } from "../../components/logo/logo";
import { useState, useRef, useEffect } from 'react';
import { UserCardList } from '../../components/user-posts-list/user-posts-list';
import { UserProfile } from '../../components/user-profile-component/user-profile-component';
import { UserPost } from '../../components/user-profile-component/user-post';
import { ProfileButton } from '../../components/profile-button/profile-button';
import { LogoutButton } from '../../components/logout/logout';
import { AdminButton } from '../../components/admin-button/admin-button';
import NotFound from '../not-found/not-found';

function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const { data: user, isLoading, error } = useGetProfileQuery(username!);
    const currentUserId = useAppSelector((state) => state.auth.userId);
    if (isLoading) {
        return (
            <div className="loading">
                <p className="loading-title">Loading</p>
            </div>
        )
    }

    if (!user) {
        return <NotFound />
    }

    const isOwner = user?.id === currentUserId;

    return (
        <>
            <header className="header">
                <div className="header__wrapper">
                    <div className="header__left">
                        <Logo />
                    </div>
                </div>
                <div
                    className="user-buttons"
                    style={{display: 'flex', gap: '.5rem'}}
                >
                    {isOwner && user?.role === 'admin' && (
                        <AdminButton />
                    )}
                    {isOwner && (
                        <LogoutButton />
                    )}
                </div>
            </header>

            <div className="layout">
                <nav className="menu">
                    <a href="/search" className="menu-item">
                        <span className="icon">
                            <svg width="24px" height="24px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M448 768A320 320 0 1 0 448 128a320 320 0 0 0 0 640z m297.344-76.992l214.592 214.592-54.336 54.336-214.592-214.592a384 384 0 1 1 54.336-54.336z" fill="currentColor"></path></g></svg>
                        </span>
                        <span className="label">Поиск</span>
                    </a>
                    <a href="/feed" className="menu-item">
                        <span className="icon">
                            <svg fill="currentColor" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" width="32px"
                                height="24px" viewBox="0 0 92 92" enableBackground="new 0 0 92 92" xmlSpace="preserve">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path id="XMLID_1210_"
                                        d="M76,2H16c-2.2,0-4,1.8-4,4v80c0,2.2,1.8,4,4,4h60c2.2,0,4-1.8,4-4V6C80,3.8,78.2,2,76,2z M72,82H20V10h52 V82z M30,67.5c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,71,57.3,71H33.5C31.6,71,30,69.4,30,67.5z M30,53.5 c0-1.9,1.6-3.5,3.5-3.5h23.8c1.9,0,3.5,1.6,3.5,3.5S59.3,57,57.3,57H33.5C31.6,57,30,55.4,30,53.5z M61,24.5c0-1.9-1.6-3.5-3.5-3.5 h-24c-1.9,0-3.5,1.6-3.5,3.5v14c0,1.9,1.6,3.5,3.5,3.5h24c1.9,0,3.5-1.6,3.5-3.5V24.5z M37,28h17v7H37V28z">
                                    </path>
                                </g>
                            </svg>
                        </span>
                        <span className="label">Лента</span>
                    </a>
                    <ProfileButton active={true} />
                </nav>

                <main className="content">
                    <div className="user-section">
                        <UserProfile />
                        {isOwner && (
                            <UserPost />
                        )}

                        <div className="post-section">
                            <p className="section-title">Заметки</p>
                            <UserCardList />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

export default ProfilePage;