import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getProducts } from "@/lib/data";
import { ProductCard } from "@/components/products/ProductCard";
import {
  Sparkles,
  Truck,
  ShieldCheck,
  ArrowRight,
  Clock,
  HeartHandshake,
  UtensilsCrossed,
  CheckCircle2,
} from "lucide-react";

export default async function HomePage() {
  const [categories, featuredProducts] = await Promise.all([
    getCategories(),
    getProducts({ featuredOnly: true }),
  ]);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-amber-50/70 via-stone-50 to-white pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100/80 border border-brand-200 text-brand-900 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-brand-700" aria-hidden="true" />
                <span>Handmade in Small Kitchen Batches</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
                Authentic Homemade Snacks, Fresh from Traditional Kitchens
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Enjoy time-tested regional savory namkeen, crunchy spiced khakhras, and pure cow ghee sweets. Prepared without industrial preservatives and delivered right to your doorstep via Cash on Delivery.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2"
                >
                  Browse Fresh Snacks
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/categories"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-md bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-semibold text-sm transition-colors text-center"
                >
                  Explore Categories
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span className="text-xs text-stone-700 font-medium">Pure Cow Ghee & Cold-Pressed Oils</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span className="text-xs text-stone-700 font-medium">No Artificial Additives</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span className="text-xs text-stone-700 font-medium">Pay via Cash on Delivery</span>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-stone-100">
                <Image
                  src="https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1000&q=85"
                  alt="Traditional Indian crispy snacks and khakhra"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/95 backdrop-blur-sm rounded-lg border border-stone-200 shadow-sm text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-stone-900 block text-sm">Crispy Methi Khakhra</span>
                      <span className="text-stone-500">Whole wheat, pure peanut oil & fresh fenugreek</span>
                    </div>
                    <span className="text-base font-extrabold text-brand-700">₹140</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
              Snack Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Explore by Snack Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group bg-white rounded-lg border border-stone-200 overflow-hidden hover:border-brand-300 hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-[16/10] bg-stone-100 overflow-hidden">
                {cat.image_url ? (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <UtensilsCrossed className="w-8 h-8" aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-bold text-base text-stone-900 group-hover:text-brand-700 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-brand-700">
                  <span>Explore Items</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-700 uppercase tracking-wider">
              Popular Picks
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Freshly Prepared This Week
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold text-brand-700 hover:text-brand-800 flex items-center gap-1"
          >
            View Complete Shop <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Brand Value Proposition: The SnackCart Promise */}
      <section className="bg-stone-900 text-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 space-y-3">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">
              Small Kitchen Ethics
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              The Way Homemade Snacks Should Taste
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              Commercial snack factories use palm oil blends, synthetic flavor enhancers, and heavy preservatives for shelf life. We cook the way homes do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-stone-800/60 p-6 rounded-lg border border-stone-700/60 space-y-3">
              <div className="w-10 h-10 rounded-md bg-brand-900/60 text-brand-400 flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-white text-base">Pure Cow Ghee & Cold-Pressed Oils</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Our ladoos are roasted exclusively with pure cow ghee. Our savory savouries are prepared in cold-pressed peanut and sunflower oils.
              </p>
            </div>

            <div className="bg-stone-800/60 p-6 rounded-lg border border-stone-700/60 space-y-3">
              <div className="w-10 h-10 rounded-md bg-brand-900/60 text-brand-400 flex items-center justify-center">
                <Clock className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-white text-base">Small Batches, Sealed for Freshness</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                We avoid massive industrial warehouse storage. Each snack batch is made in manageable small pans, heat-sealed airtight, and dispatched promptly.
              </p>
            </div>

            <div className="bg-stone-800/60 p-6 rounded-lg border border-stone-700/60 space-y-3">
              <div className="w-10 h-10 rounded-md bg-brand-900/60 text-brand-400 flex items-center justify-center">
                <Truck className="w-5 h-5" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-white text-base">Hassle-Free Cash on Delivery</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Shop with complete peace of mind. Pay the exact parcel amount in cash directly to your delivery courier upon receiving your snacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Cash on Delivery Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-stone-200 rounded-xl p-8 bg-white space-y-8">
          <div className="max-w-2xl">
            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              Simple 4-Step Cash on Delivery Experience
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Order today without entering credit card or UPI details upfront.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-sm text-stone-900">Choose Your Snacks</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Add your favorite savory namkeens, crisps, or handmade ladoos to your cart.
              </p>
            </div>

            <div className="space-y-2">
              <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-sm text-stone-900">Provide Delivery Address</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Enter your recipient name, phone number, and 6-digit postal PIN code.
              </p>
            </div>

            <div className="space-y-2">
              <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-sm text-stone-900">Kitchen Dispatches Package</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Fresh parcels are packed airtight and dispatched via speed courier service.
              </p>
            </div>

            <div className="space-y-2">
              <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center">
                4
              </span>
              <h3 className="font-bold text-sm text-stone-900">Pay Cash at Doorstep</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Hand the exact order total to the delivery executive and enjoy your fresh snacks.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
