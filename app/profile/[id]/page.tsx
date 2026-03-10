'use client'

import { MOCK_USERS } from "@/lib/mock-data/users";
import { MOCK_REVIEWS } from "@/lib/mock-data/reviews";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, MessageCircle, Dog, CigaretteOff, CheckCircle2, LogOut, Edit2 } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { use } from "react";

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const resolvedId = id === "undefined" ? "u1" : id;
    const profileUser = MOCK_USERS.find(u => u.id === resolvedId) || MOCK_USERS[1]; // fallback to mock u2
    const reviews = MOCK_REVIEWS.filter(r => r.revieweeId === profileUser.id);
    const { user, logout } = useAuthStore();

    // Safely assume the current user is 'u1' if missing from old persisted states
    const effectiveUserId = user?.id || "u1";
    const isCurrentUser = user && effectiveUserId === profileUser.id;

    return (
        <div className="bg-surface-bg min-h-screen">
            {/* Cover / Header */}
            <div className="bg-surface-container h-48 relative border-b border-surface-outline/10">
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 md:left-24 md:translate-x-0">
                    <Avatar
                        src={profileUser.avatarUrl}
                        size="xl"
                        verified={profileUser.isVerified}
                        className="w-32 h-32 border-4 border-surface-bg"
                    />
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-4xl pt-20 pb-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
                            {isCurrentUser ? user.name : profileUser.name}
                            {profileUser.isVerified && <ShieldCheck className="w-8 h-8 text-brand-primary" />}
                        </h1>
                        <div className="text-text-secondary mt-1">
                            Member since {new Date(profileUser.memberSince).getFullYear()} • {profileUser.totalTrips} rides published
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-end gap-4">
                        <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 font-medium px-4 py-2 rounded-full border border-yellow-200">
                            ★ {profileUser.rating} ({reviews.length} reviews)
                        </div>
                        {isCurrentUser && (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="gap-2" onClick={() => alert("Demo: Edit profile clicked")}>
                                    <Edit2 className="w-4 h-4" /> Edit
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={logout}>
                                    <LogOut className="w-4 h-4" /> Logout
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">

                    {/* Left info column */}
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-text-primary mb-4">Verifications</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 text-text-secondary">
                                        <CheckCircle2 className="w-5 h-5 text-brand-primary" /> Verified Phone Number
                                    </div>
                                    <div className="flex items-center gap-3 text-text-secondary">
                                        <CheckCircle2 className="w-5 h-5 text-brand-primary" /> Verified Email
                                    </div>
                                    {profileUser.isVerified && (
                                        <div className="flex items-center gap-3 text-text-secondary">
                                            <CheckCircle2 className="w-5 h-5 text-brand-primary" /> Verified Government ID
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h3 className="font-semibold text-text-primary mb-4">Preferences</h3>
                                <div className="space-y-3">
                                    
                                    <div className="flex items-center gap-3 text-text-secondary">
                                        <CigaretteOff className="w-5 h-5 text-brand-primary" /> {profileUser.preferences.smoking ? 'Smoking allowed' : 'No smoking'}
                                    </div>
                                    <div className="flex items-center gap-3 text-text-secondary">
                                        <Dog className="w-5 h-5 text-brand-primary" /> {profileUser.preferences.pets ? 'Pets allowed' : 'No pets'}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right text & reviews */}
                    <div className="md:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-text-primary mb-4">About {(isCurrentUser ? user.name : profileUser.name).split(' ')[0]}</h2>
                            <div className="bg-surface-container rounded-3xl p-6 md:p-8 text-lg text-text-secondary leading-relaxed border border-surface-outline/10">
                                "{profileUser.bio || "This user hasn't added a bio yet."}"
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-text-primary mb-6">Reviews</h2>
                            {reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {reviews.map(r => {
                                        const reviewer = MOCK_USERS.find(u => u.id === r.reviewerId);
                                        return (
                                            <div key={r.id} className="border border-surface-outline/10 bg-surface-bg p-6 rounded-3xl relative">
                                                <div className="flex items-center gap-1 text-yellow-500 mb-3 text-lg">
                                                    ★ {r.rating}
                                                </div>
                                                <p className="text-text-primary mb-5">"{r.comment}"</p>
                                                <div className="flex items-center gap-3">
                                                    <Avatar src={reviewer?.avatarUrl} size="sm" />
                                                    <div className="text-sm">
                                                        <span className="font-medium text-text-primary">{reviewer?.name}</span>
                                                        <span className="text-text-secondary block">{r.createdAt.split('T')[0]}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <p className="text-text-secondary bg-surface-container p-6 rounded-3xl text-center">No reviews received yet.</p>
                            )}
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
}
