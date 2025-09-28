import { cn } from "@/lib/utils"

interface AnimatedBeamMultipleOutputDemoProps {
  className?: string
}

export default function AnimatedBeamMultipleOutputDemo({ className }: AnimatedBeamMultipleOutputDemoProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Central node */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>
      
      {/* Output nodes */}
      {[
        { x: "20%", y: "20%", color: "bg-green-500" },
        { x: "80%", y: "20%", color: "bg-purple-500" },
        { x: "20%", y: "80%", color: "bg-orange-500" },
        { x: "80%", y: "80%", color: "bg-red-500" },
      ].map((node, index) => (
        <div key={index} className="absolute" style={{ left: node.x, top: node.y }}>
          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center animate-bounce", node.color)}>
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      ))}
      
      {/* Animated lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {[
          { x1: "50%", y1: "50%", x2: "20%", y2: "20%" },
          { x1: "50%", y1: "50%", x2: "80%", y2: "20%" },
          { x1: "50%", y1: "50%", x2: "20%", y2: "80%" },
          { x1: "50%", y1: "50%", x2: "80%", y2: "80%" },
        ].map((line, index) => (
          <line
            key={index}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="currentColor"
            strokeWidth="2"
            className="text-blue-300 animate-pulse"
            style={{ animationDelay: `${index * 0.2}s` }}
          />
        ))}
      </svg>
    </div>
  )
}
