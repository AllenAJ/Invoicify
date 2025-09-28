import { cn } from "@/lib/utils"

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  )
}

export const BentoCard = ({
  className,
  name,
  className: nameClassName,
  description,
  href,
  cta,
  background,
  Icon,
}: {
  className?: string
  name?: React.ReactNode
  nameClassName?: string
  description?: string
  href?: string
  cta?: string
  background?: React.ReactNode
  Icon?: React.ComponentType<{ className?: string }>
}) => {
  return (
    <div
      key={name?.toString()}
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
        "bg-white dark:bg-black",
        "border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-100 dark:from-neutral-900 to-neutral-100/50 dark:to-neutral-900/50" />
      <div className="relative flex h-full min-h-[18rem] flex-col p-6">
        <div className="flex items-center gap-2 mb-4">
          {Icon && <Icon className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />}
          <span className={cn("text-lg font-semibold", nameClassName)}>{name}</span>
        </div>
        <div className="text-neutral-600 dark:text-neutral-300 text-sm mb-4">
          {description}
        </div>
        {href && cta && (
          <a
            href={href}
            className="inline-flex items-center text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {cta}
            <svg
              className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        )}
      </div>
      {background}
    </div>
  )
}
