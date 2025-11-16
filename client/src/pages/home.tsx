import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Hero_background_purple_tech_2bf35a47.png";

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-violet-900/80 to-background" />
        
        <div className="relative z-10 container mx-auto px-6 text-center space-y-8">
          <div className="space-y-4">
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-200 via-violet-200 to-purple-300 bg-clip-text text-transparent"
              data-testid="text-hero-title"
            >
              Premium Gaming Products
            </h1>
            <p
              className="text-xl md:text-2xl text-purple-100/90 max-w-2xl mx-auto"
              data-testid="text-hero-subtitle"
            >
              Exclusive digital goods with instant Discord integration and real-time order tracking
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products">
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-2xl shadow-purple-500/50 text-lg px-8"
                data-testid="button-browse-store"
              >
                Browse Store
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 backdrop-blur-md bg-purple-500/10 border-purple-400/50 hover:bg-purple-500/20 text-purple-100 text-lg px-8"
              data-testid="button-learn-more"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4 text-center p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1" data-testid="card-feature-discord">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30">
              <MessageSquare className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold">Discord Integration</h3>
            <p className="text-muted-foreground">
              Seamless order tracking and support through Discord. Get instant updates via DM.
            </p>
          </div>

          <div className="space-y-4 text-center p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1" data-testid="card-feature-instant">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30">
              <Zap className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold">Instant Delivery</h3>
            <p className="text-muted-foreground">
              Fast processing with automated notifications. Track your order every step of the way.
            </p>
          </div>

          <div className="space-y-4 text-center p-8 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1" data-testid="card-feature-secure">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/20 border border-purple-500/30">
              <Shield className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold">Secure Checkout</h3>
            <p className="text-muted-foreground">
              Safe and reliable payment processing with full transparency and support.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-transparent to-purple-500/5">
        <div className="container mx-auto px-6 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our exclusive collection of premium digital products and gaming goods.
            </p>
          </div>
          <Link href="/products">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 shadow-lg shadow-purple-500/30 text-lg px-8"
              data-testid="button-shop-now"
            >
              Shop Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
