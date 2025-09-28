"use client";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Content Section */}
      <div className="text-center space-y-8 py-16 px-4">
        <div className="flex justify-center mb-8">
          <img 
            src="/PYUSD-token.png" 
            alt="PYUSD Token" 
            className="w-20 h-20 rounded-full shadow-lg"
          />
        </div>
        <h1 className="text-4xl font-semibold text-black dark:text-white">
          Transform Your Invoices Into <br />
          <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-[#0070ba]">
            Instant Cash
          </span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mt-6 max-w-3xl mx-auto">
          Get paid immediately for your outstanding invoices with PYUSD. 
          No waiting, no hassle - just instant liquidity for your business.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link to="/factor-your-invoice">
            <Button 
              size="lg" 
              className="minimal-button paypal-primary shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4"
            >
              Factor Your Invoice
            </Button>
          </Link>
          <Link to="/investor">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-[#0070ba] text-[#0070ba] hover:bg-[#0070ba] hover:text-white transition-all duration-300 text-lg px-8 py-4"
            >
              Provide Liquidity
            </Button>
          </Link>
        </div>
      </div>

      {/* Scroll Animation Section */}
      <div className="">
        <ContainerScroll
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <img
              src="/Group 1.png"
              alt="Invoicify Invoice Processing"
              className="h-full w-full object-cover object-center"
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <h3 className="text-2xl font-bold mb-2">Real-time Invoice Processing</h3>
              <p className="text-lg opacity-90">
                Upload your invoice and receive instant PYUSD payment within minutes
              </p>
            </div>
          </div>
        </ContainerScroll>
      </div>
    </div>
  );
}
