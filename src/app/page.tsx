import CategoryList from "@/components/CategoryList";
import ProductList from "@/components/ProductList";
import Skeleton from "@/components/Skeleton";
import Slider from "@/components/Slider";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";

const HomePage = async () => {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
         
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black"></div>
        </div>
        
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.2em] mb-6 uppercase">
            <span className="block">Timeless</span>
            <span className="block mt-2 text-gold-400">Elegance</span>
          </h1>
          
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-400 to-transparent my-8"></div>
          
          <p className="max-w-xl text-lg md:text-xl font-light tracking-wider mb-12 text-gray-200">
            Exquisite jewelry crafted for those who appreciate the extraordinary
          </p>
          
          <Link 
            href="/collection"
            className="group relative overflow-hidden border border-gold-400 text-gold-400 px-12 py-4 uppercase tracking-widest text-sm hover:text-black transition-colors duration-500"
          >
            <span className="relative z-10">Discover Collection</span>
            <span className="absolute inset-0 bg-gold-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
          </Link>
        </div>
        
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
          <span className="w-2 h-2 rounded-full bg-gold-400"></span>
          <span className="w-2 h-2 rounded-full bg-white/30"></span>
          <span className="w-2 h-2 rounded-full bg-white/30"></span>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-32 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-gradient-to-b from-black to-gray-900">
        <div className="text-center mb-16">
          <span className="text-gold-400 uppercase tracking-[0.3em] text-sm">The Finest Selection</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-wide mt-4 mb-6">Featured Collection</h2>
          <div className="flex items-center justify-center">
            <div className="h-[1px] w-16 bg-gold-400/30"></div>
            <div className="mx-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22L1 11 12 0l11 11-11 11z" fill="#D4AF37" fillOpacity="0.6" />
              </svg>
            </div>
            <div className="h-[1px] w-16 bg-gold-400/30"></div>
          </div>
        </div>
        
        <Suspense fallback={<Skeleton />}>
          <div className="relative">
            <ProductList
              categoryId={process.env.FEATURED_PRODUCTS_FEATURED_CATEGORY_ID!}
              limit={4}
            />
            <div className="absolute -top-6 -bottom-6 -left-6 -right-6 border border-gold-400/10 -z-10"></div>
          </div>
        </Suspense>
        
        <div className="text-center mt-12">
          <Link 
            href="/list?cat=all-products" 
            className="inline-block text-sm uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors"
          >
            View All Pieces
          </Link>
        </div>
      </section>

      {/* Luxury Statement Section */}
      <section className="py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
       
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-5xl font-light italic mb-8">"Jewelry is the perfect spice. It complements what's already there."</h2>
          <p className="text-gold-400 uppercase tracking-widest">Diane Von Furstenberg</p>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center mb-16">
          <span className="text-gold-400 uppercase tracking-[0.3em] text-sm">Browse By</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-wide mt-4 mb-6">Categories</h2>
          <div className="flex items-center justify-center">
            <div className="h-[1px] w-16 bg-gold-400/30"></div>
            <div className="mx-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22L1 11 12 0l11 11-11 11z" fill="#D4AF37" fillOpacity="0.6" />
              </svg>
            </div>
            <div className="h-[1px] w-16 bg-gold-400/30"></div>
          </div>
        </div>
        
        <Suspense fallback={<Skeleton />}>
          <CategoryList />
        </Suspense>
      </section>

      {/* New Arrivals Section */}
      <section className="py-32 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 bg-black relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent"></div>
        
        <div className="text-center mb-16">
          <span className="text-gold-400 uppercase tracking-[0.3em] text-sm">Just Arrived</span>
          <h2 className="text-3xl md:text-4xl font-light tracking-wide mt-4 mb-6">New Collection</h2>
          <div className="flex items-center justify-center">
            <div className="h-[1px] w-16 bg-gold-400/30"></div>
            <div className="mx-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22L1 11 12 0l11 11-11 11z" fill="#D4AF37" fillOpacity="0.6" />
              </svg>
            </div>
            <div className="h-[1px] w-16 bg-gold-400/30"></div>
          </div>
        </div>
        
        <Suspense fallback={<Skeleton />}>
          <div className="relative">
            <ProductList
              categoryId={process.env.FEATURED_PRODUCTS_NEW_CATEGORY_ID!}
              limit={4}
            />
            <div className="absolute -top-6 -bottom-6 -left-6 -right-6 border border-gold-400/10 -z-10"></div>
          </div>
        </Suspense>
        
        <div className="text-center mt-12">
          <Link 
            href="/products/new" 
            className="inline-block text-sm uppercase tracking-widest text-gold-400 hover:text-gold-300 transition-colors"
          >
            View All New Arrivals
          </Link>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-32 bg-gradient-to-b from-black to-gray-900 relative">
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
          <div className="relative aspect-square overflow-hidden">
            
            <div className="absolute inset-0 border border-gold-400/20"></div>
          </div>
          
          <div className="text-center md:text-left md:pl-8">
            <span className="text-gold-400 uppercase tracking-[0.3em] text-sm">Our Promise</span>
            <h2 className="text-3xl md:text-4xl font-light tracking-wide mt-4 mb-8">Exquisite Craftsmanship</h2>
            
            <p className="text-gray-300 leading-relaxed mb-8">
              Each piece in our collection is meticulously crafted by master artisans with decades of experience. 
              We source only the finest materials, ensuring that every creation meets our exacting standards of 
              quality and beauty.
            </p>
            
            <Link 
              href="/about" 
              className="inline-block border-b border-gold-400 text-gold-400 pb-1 uppercase tracking-widest text-sm hover:text-gold-300 hover:border-gold-300 transition-colors"
            >
              Discover Our Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
