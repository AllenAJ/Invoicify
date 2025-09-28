import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons"
import { BellIcon, Share2Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import Calendar from "@/components/ui/calendar"
import AnimatedBeamMultipleOutputDemo from "./AnimatedBeamMultipleOutputDemo"
import AnimatedListDemo from "./AnimatedListDemo"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import Marquee from "@/components/ui/marquee"

const files = [
  {
    name: "invoice-001.pdf",
    body: "Invoice from Acme Corp for services rendered.",
  },
  {
    name: "invoice-002.pdf",
    body: "Invoice from Beta LLC for product delivery.",
  },
  {
    name: "invoice-003.pdf",
    body: "Invoice from Gamma Inc. for consulting fees.",
  },
  {
    name: "invoice-004.pdf",
    body: "Invoice from Delta Solutions for software license.",
  },
  {
    name: "invoice-005.pdf",
    body: "Design services invoice for brand identity and marketing materials.",
  },
]

const features = [
  {
    name: "",
    description: "",
    href: "/factor-your-invoice",
    cta: "",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] [--duration:20s]"
      >
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    name: "",
    description: "",
    href: "/dashboard",
    cta: "",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedListDemo className="absolute top-4 right-2 h-[300px] w-full scale-75 border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90" />
    ),
  },
  {
    name: "PYUSD Integration",
    description: "Seamlessly integrate with PayPal's PYUSD stablecoin for instant, secure payments.",
    href: "/investor",
    cta: "Provide Liquidity",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedBeamMultipleOutputDemo className="absolute top-4 right-2 h-[300px] border-none [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-105" />
    ),
  },
  {
    name: "",
    description: "",
    className: "col-span-3 lg:col-span-1",
    href: "/dashboard",
    cta: "",
    background: (
      <Calendar
        mode="single"
        selected={new Date(2024, 11, 15, 0, 0, 0)}
        className="absolute top-10 right-0 origin-top scale-75 rounded-md border [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] transition-all duration-300 ease-out group-hover:scale-90"
      />
    ),
  },
]

export function BentoDemo() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  )
}