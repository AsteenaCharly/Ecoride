"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, CheckCircle2 } from "lucide-react";

export default function EditProfilePage() {
    const { user, updateProfile } = useAuthStore();

    const [bio, setBio] = useState(user?.bio || "");
    const [smoking, setSmoking] = useState(user?.preferences?.smoking || false);
    const [pets, setPets] = useState(user?.preferences?.pets || false);

    const [idVerified, setIdVerified] = useState(user?.isVerified || false);
    const [verifying, setVerifying] = useState(false);

    if (!user) return null;

    const handleSave = () => {
        updateProfile({
            bio,
            preferences: {
                ...user.preferences,
                smoking,
                pets,
            }
        });
        alert("Profile saved successfully");
    };

    const simulateIdVerification = () => {
        setVerifying(true);
        setTimeout(() => {
            setIdVerified(true);
            setVerifying(false);
            updateProfile({ isVerified: true });
        }, 2000);
    };

    return (
        <div className="bg-surface-bg min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-2xl">
                <h1 className="text-3xl font-bold text-text-primary mb-8">Edit Profile</h1>

                {/* Photo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative group cursor-pointer">
                        <Avatar src={user.avatarUrl} size="xl" verified={idVerified} />
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Camera className="w-8 h-8 text-white" />
                        </div>
                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                    </div>
                    <p className="text-sm text-text-secondary mt-3">Tap to change profile photo</p>
                </div>

                <div className="space-y-8">

                    <section>
                        <h2 className="text-xl font-bold mb-4 border-b border-surface-outline/10 pb-2">Personal info</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-text-secondary">Full Name</label>
                                <Input value={user.name} disabled className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-text-secondary">Phone Number</label>
                                <Input value={user.phone} disabled className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-text-secondary">Bio</label>
                                <textarea
                                    className="w-full mt-1 bg-surface-low border-b-2 border-surface-outline rounded-t-xl px-4 py-3 text-text-primary outline-none focus:border-brand-primary transition-colors min-h-[100px] resize-none"
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                    placeholder="Tell other members a bit about yourself..."
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 border-b border-surface-outline/10 pb-2">Travel Preferences</h2>
                        <div className="space-y-4 bg-surface-container rounded-3xl p-6 border border-surface-outline/10">
                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <div className="font-semibold text-text-primary">Smoking</div>
                                    <div className="text-sm text-text-secondary">Allow smoking in the car</div>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 accent-brand-primary"
                                    checked={smoking}
                                    onChange={e => setSmoking(e.target.checked)}
                                />
                            </label>

                            <div className="h-px bg-surface-outline/10" />

                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <div className="font-semibold text-text-primary">Pets</div>
                                    <div className="text-sm text-text-secondary">Allow pets in the car</div>
                                </div>
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 accent-brand-primary"
                                    checked={pets}
                                    onChange={e => setPets(e.target.checked)}
                                />
                            </label>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-4 border-b border-surface-outline/10 pb-2">Verification</h2>

                        <div className={`rounded-3xl p-6 border ${idVerified ? 'bg-brand-primary5 border-brand-primary/20' : 'bg-surface-container border-surface-outline/10'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-text-primary flex items-center gap-2">
                                        Government ID
                                        {idVerified && <CheckCircle2 className="w-5 h-5 text-brand-primary" />}
                                    </h3>
                                    <p className="text-sm text-text-secondary mt-1">
                                        {idVerified
                                            ? "Your identity is verified. This builds trust in the community."
                                            : "Verify your ID to get the trusted badge."}
                                    </p>
                                </div>
                            </div>

                            {!idVerified && (
                                <div className="mt-4">
                                    <Button
                                        variant="outline"
                                        className="w-full relative overflow-hidden"
                                        onClick={simulateIdVerification}
                                        disabled={verifying}
                                    >
                                        {verifying ? "Processing..." : "Upload Aadhaar / PAN"}
                                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*, application/pdf" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </section>

                    <Button size="lg" className="w-full h-14 text-lg mt-8" onClick={handleSave}>
                        Save Changes
                    </Button>

                </div>
            </div>
        </div>
    );
}
