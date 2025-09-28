import { cn } from "@/lib/utils"

interface AnimatedListDemoProps {
  className?: string
}

export default function AnimatedListDemo({ className }: AnimatedListDemoProps) {
  const items = [
    { id: 1, text: "Invoice #001 - $5,000", status: "pending" },
    { id: 2, text: "Invoice #002 - $3,200", status: "approved" },
    { id: 3, text: "Invoice #003 - $7,800", status: "processing" },
    { id: 4, text: "Invoice #004 - $2,100", status: "completed" },
    { id: 5, text: "Invoice #005 - $4,500", status: "pending" },
  ]

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "flex items-center justify-between p-3 rounded-lg border",
            "bg-white/50 dark:bg-gray-800/50",
            "border-gray-200 dark:border-gray-700",
            "animate-pulse"
          )}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {item.text}
          </span>
          <span
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              {
                "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400":
                  item.status === "pending",
                "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400":
                  item.status === "approved",
                "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400":
                  item.status === "processing",
                "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400":
                  item.status === "completed",
              }
            )}
          >
            {item.status}
          </span>
        </div>
      ))}
    </div>
  )
}
