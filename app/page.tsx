import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Star, Users } from "lucide-react";
import { RideSearchForm } from "@/components/rides/RideSearchForm";
import { Avatar } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full px-4 md:px-8 py-6 md:py-10 max-w-7xl mx-auto z-30">
        <div className="relative  bg-brand-primary/80  rounded-[48px] min-h-[500px] flex flex-col items-center justify-center  py-20 px-4">
          {/* Decorative Blur Blobs */}

          <div className="relative z-10 text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-onprimary mb-6">
              Share the ride, share the road
            </h1>
            <p className="text-lg text-text-onprimary md:text-xl  leading-relaxed">
              Travel comfortably and affordably. Join thousands of verified members matching every day on EcoRide.
            </p>
          </div>

          <div className="relative z-20 w-full max-w-5xl mx-auto">
            <RideSearchForm />
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex justify-between items-end mb-10">
          <h2 className="text-3xl font-bold text-text-primary">Popular routes</h2>
          <Link href="/rides" className="text-brand-primary font-medium flex items-center gap-1 hover:underline">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { from: "Mumbai", to: "Pune", price: 450, trips: "2.4k" },
            { from: "Delhi", to: "Agra", price: 500, trips: "1.8k" },
            { from: "Bangalore", to: "Mysore", price: 300, trips: "3.1k" },
            { from: "Chennai", to: "Pondicherry", price: 600, trips: "1.2k" },
            { from: "Hyderabad", to: "Vijayawada", price: 550, trips: "900" },
            { from: "Jaipur", to: "Udaipur", price: 700, trips: "650" },
          ].map((route, idx) => (
            <Link
              key={idx}
              href={`/rides?from=${route.from}&to=${route.to}`}
              className="bg-surface-bg border border-surface-outline/10 rounded-3xl p-6 hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex items-center justify-between group"
            >
              <div>
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                  {route.from} → {route.to}
                </h3>
                <p className="text-sm text-text-secondary mt-1">{route.trips} trips this week</p>
              </div>
              <div className="text-right">
                <span className="text-sm text-text-secondary block">from</span>
                <span className="text-xl font-bold text-brand-primary">₹{route.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust & Stats */}
      <section className="bg-surface-container py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-brand-primary10 rounded-full flex items-center justify-center mb-6 text-brand-primary">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">2M+ rides shared</h3>
              <p className="text-text-secondary">Our growing community makes travel easier and more social every single day.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-brand-primary10 rounded-full flex items-center justify-center mb-6 text-brand-primary">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">98% on-time</h3>
              <p className="text-text-secondary">Punctuality is our priority. Most of our rides depart exactly as scheduled.</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-brand-primary10 rounded-full flex items-center justify-center mb-6 text-brand-primary">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">Verified drivers</h3>
              <p className="text-text-secondary">We check IDs, phone numbers, and reviews to ensure your absolute safety.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-3xl font-bold text-text-primary text-center mb-12">Loved by thousands</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Rahul S.", rating: 5, quote: "I use EcoRide every weekend to visit my parents. It's so much cheaper than taking a train, and I've met some great people!" },
            { name: "Priya D.", rating: 5, quote: "As a driver, filling my empty seats helps cover my fuel costs completely. The app is incredibly easy to use." },
            { name: "Arjun V.", rating: 4, quote: "The verified profiles make me feel safe. I love that I can choose a quiet ride after a long day at work." }
          ].map((review, idx) => (
            <div key={idx} className="bg-surface-bg border border-surface-outline/10 rounded-3xl p-8 shadow-sm">
              <div className="flex gap-1 text-yellow-500 mb-4">
                {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-text-secondary text-base italic mb-6">"{review.quote}"</p>
              <div className="flex items-center gap-3">
                <Avatar src={`https://i.pravatar.cc/150?u=${idx + 10}`} size="sm" />
                <span className="font-semibold text-text-primary">{review.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}