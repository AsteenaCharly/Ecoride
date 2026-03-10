"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { useRidesStore } from "@/lib/store/rides";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Route, Users, Star, IndianRupee, MapPin } from "lucide-react";

const mockEarningsData = [
    { name: 'Week 1', earnings: 1200 },
    { name: 'Week 2', earnings: 850 },
    { name: 'Week 3', earnings: 2400 },
    { name: 'Week 4', earnings: 1800 },
    { name: 'Week 5', earnings: 3100 },
    { name: 'Week 6', earnings: 900 },
];

export default function DashboardPage() {
    const { user } = useAuthStore();
    const [view, setView] = useState<"driver" | "passenger">("driver");

    // The global AuthGuard handles redirection if user is null.
    if (!user) return null;

    return (
        <div className="bg-surface-bg min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Avatar src={user.avatarUrl} verified={user.isVerified} size="lg" />
                        <div>
                            <h1 className="text-2xl font-bold text-text-primary">Welcome back, {user.name.split(' ')[0]}</h1>
                            <p className="text-text-secondary flex items-center gap-1">★ {user.rating} ({user.totalTrips} trips)</p>
                        </div>
                    </div>

                    <div className="bg-surface-container rounded-full p-1 flex">
                        <button
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${view === 'driver' ? 'bg-surface-bg shadow-sm text-text-primary' : 'text-text-secondary'}`}
                            onClick={() => setView("driver")}
                        >
                            Driver View
                        </button>
                        <button
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${view === 'passenger' ? 'bg-surface-bg shadow-sm text-text-primary' : 'text-text-secondary'}`}
                            onClick={() => setView("passenger")}
                        >
                            Passenger View
                        </button>
                    </div>
                </div>

                {view === "driver" ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <StatCard icon={<Route />} label="Rides Published" value="12" />
                            <StatCard icon={<Users />} label="Passengers" value="48" />
                            <StatCard icon={<IndianRupee />} label="This Month" value="₹8,450" />
                            <StatCard icon={<Star />} label="Average Rating" value="4.9" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <h2 className="text-xl font-bold text-text-primary mb-4">Earnings History</h2>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={mockEarningsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#79747E' }} />
                                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} tick={{ fontSize: 12, fill: '#79747E' }} />
                                                    <Tooltip
                                                        cursor={{ fill: '#F3FAF3' }}
                                                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                                        formatter={(value: any) => [`₹${value}`, "Earnings"]}
                                                    />
                                                    <Bar dataKey="earnings" radius={[4, 4, 0, 0]}>
                                                        {mockEarningsData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={index === mockEarningsData.length - 1 ? '#177d19' : '#8cdba0'} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-text-primary mb-4">Recent Payouts</h2>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="space-y-6">
                                            {[
                                                { date: "Oct 24, 2023", amount: 1800, route: "Mumbai → Pune" },
                                                { date: "Oct 12, 2023", amount: 2400, route: "Pune → Lonavala" },
                                                { date: "Sep 28, 2023", amount: 3100, route: "Mumbai → Surat" },
                                            ].map((payout, i) => (
                                                <div key={i} className="flex justify-between items-center pb-4 border-b border-surface-outline/10 last:border-0 last:pb-0">
                                                    <div>
                                                        <div className="font-medium text-text-primary">{payout.route}</div>
                                                        <div className="text-sm text-text-secondary">{payout.date}</div>
                                                    </div>
                                                    <div className="font-bold text-brand-primary">{formatCurrency(payout.amount)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <StatCard icon={<Route />} label="Total Trips" value="22" />
                            <StatCard icon={<MapPin />} label="Cities Visited" value="8" />
                            <StatCard icon={<IndianRupee />} label="Money Saved" value="₹14,200" />
                            <StatCard icon={<Star />} label="Reviews Given" value="18" />
                        </div>

                        <div className="mt-12 text-center py-20 bg-surface-container rounded-[48px] border border-surface-outline/10">
                            <Avatar src="https://api.dicebear.com/9.x/avataaars/svg?seed=Rahul" className="w-20 h-20 mx-auto mb-6 border-4 border-surface-bg shadow-xl opacity-50 grayscale" />
                            <h3 className="text-2xl font-bold text-text-primary mb-2">Ready for your next adventure?</h3>
                            <p className="text-text-secondary mb-8">Mapbox travel history simulation goes here in the real build.</p>
                            <div className="flex gap-4 justify-center">
                                <a href="/rides" className="bg-brand-primary text-white px-8 py-3 rounded-full font-medium hover:bg-brand-primary90 transition-colors">Find a ride</a>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="w-10 h-10 bg-brand-primary10 text-brand-primary rounded-full flex items-center justify-center mb-4">
                    {icon}
                </div>
                <div className="text-sm font-medium text-text-secondary mb-1">{label}</div>
                <div className="text-3xl font-bold text-text-primary">{value}</div>
            </CardContent>
        </Card>
    );
}
