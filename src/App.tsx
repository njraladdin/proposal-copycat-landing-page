'use client'

import { useState, useRef } from 'react'
import './App.css'

import { useEffect } from 'react'

import { motion } from 'framer-motion'
import { Chrome, Github, FileText } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Clock, Zap } from 'lucide-react'

// ... existing code ...

// Add this component definition before the LandingPage component
interface ComparisonCardProps {
  icon: React.ElementType
  label: string
  time: string
  description: string
  variant: 'before' | 'after'
}

function ComparisonCard({ icon: Icon, label, time, description, variant }: ComparisonCardProps) {
  return (
    <motion.div
      className="flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className={`rounded-[1.5rem] p-6 mb-6 ${
        variant === 'before' 
          ? 'bg-gray-100/50' 
          : 'bg-[#14a800]/10'
      }`}>
        <Icon className={`h-12 w-12 ${
          variant === 'before' 
            ? 'text-gray-600' 
            : 'text-[#14a800]'
        }`} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{label}</h3>
      <p className={`text-4xl font-bold mb-4 ${
        variant === 'before' 
          ? 'text-gray-700' 
          : 'text-[#14a800]'
      }`}>
        {time}
      </p>
      <p className="text-gray-600 text-center max-w-xs">{description}</p>
      {variant === 'after' && (
        <Button
          size="lg"
          style={{ backgroundColor: '#14a800', color: 'white' }}
          className="mt-8 hover:bg-[#14a800]/90"
        >
          Get Extension
          <Chrome className="ml-2 h-4 w-4" />
        </Button>
      )}
    </motion.div>
  )
}

const Link = ({ children, className, href = "#" }: { children: React.ReactNode; className?: string; href?: string }) => {
  return <a href={href} className={className}>{children}</a>
}

interface AnimatedBeamProps {
  containerRef: React.RefObject<HTMLDivElement>;
  fromRef: React.RefObject<HTMLDivElement>;
  toRef: React.RefObject<HTMLDivElement>;
  curvature?: number;
  duration?: number;
  delay?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  reverse?: boolean;
}

const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  duration = 2,
  delay = 0,
  gradientStartColor = "#9c40ff",
  gradientStopColor = "#ffaa40",
  reverse = false,
}) => {
  const [pathD, setPathD] = useState("")
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })
  const gradientId = useRef(`beam-gradient-${Math.random().toString(36).substr(2, 9)}`).current

  useEffect(() => {
    const updatePath = () => {
      if (containerRef.current && fromRef.current && toRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const fromRect = fromRef.current.getBoundingClientRect()
        const toRect = toRef.current.getBoundingClientRect()

        const svgWidth = containerRect.width
        const svgHeight = containerRect.height
        setSvgDimensions({ width: svgWidth, height: svgHeight })

        const startX = fromRect.left - containerRect.left + fromRect.width / 2
        const startY = fromRect.top - containerRect.top + fromRect.height / 2
        const endX = toRect.left - containerRect.left + toRect.width / 2
        const endY = toRect.top - containerRect.top + toRect.height / 2

        // Calculate control point for the quadratic curve
        const midX = (startX + endX) / 2
        const midY = (startY + endY) / 2
        const controlX = midX
        const controlY = midY - curvature

        const d = `M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`
        setPathD(d)
      }
    }

    // Initial update
    updatePath()

    // Add window resize listener
    window.addEventListener('resize', updatePath)

    // Setup ResizeObserver
    const resizeObserver = new ResizeObserver(updatePath)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener('resize', updatePath)
      resizeObserver.disconnect()
    }
  }, [containerRef, fromRef, toRef, curvature])

  return (
    <svg
      width={svgDimensions.width}
      height={svgDimensions.height}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={reverse ? gradientStopColor : gradientStartColor} />
          <stop offset="100%" stopColor={reverse ? gradientStartColor : gradientStopColor} />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        stroke="#e5e7eb"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <motion.path
        d={pathD}
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0, pathOffset: 0 }}
        animate={{ 
          pathLength: [0, 1, 0],
          opacity: [0, 1, 0],
          pathOffset: [0, 0, 1]
        }}
        transition={{
          delay,
          duration: duration * 2,
          times: [0, 0.5, 1],
          ease: "linear",
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        }}
      />
    </svg>
  )
}

// Keep only this logo component and rename it
const Logo = ({ size = "default" }: { size?: "small" | "default" | "large" }) => {
  const sizes = {
    small: {
      container: "w-12 h-12",
      image: "w-9 h-9"
    },
    default: {
      container: "w-16 h-16",
      image: "w-12 h-12"
    },
    large: {
      container: "w-48 h-48",
      image: "w-36 h-36"
    }
  }

  // Use smaller Android Chrome icon for small sizes
  if (size === "small") {
    return (
      <div className={`${sizes[size].container} rounded-xl flex items-center justify-center`}>
        <img 
          src="/android-chrome-192x192.png"
          alt="Proposal Copycat Logo" 
          className={`${sizes[size].image} object-contain`}
        />
      </div>
    )
  }

  // Use larger Android Chrome icon for bigger sizes
  return (
    <div className={`${sizes[size].container} relative`}>
      <img 
        src="/android-chrome-512x512.png"
        alt="Proposal Copycat Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  )
}

export function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const aiRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const proposalRefs = Array(5).fill(0).map(() => useRef<HTMLDivElement>(null))
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link className="flex items-center gap-2" href="#">
          <Logo size="small" />
          <span className="font-semibold text-lg">Proposal Copycat</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Logo size="large" />
              <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Proposal Copycat
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Train AI to write proposals in your style by analyzing your successful Upwork proposals.
                </p>
              </div>
              <div className="space-x-4 pt-8">
                <Button
                  size="lg"
                  style={{ backgroundColor: '#14a800', color: 'white' }}
                  className="hover:bg-[#14a800]/90"
                >
                  Get Chrome Extension
                  <Chrome className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={() => window.open('https://github.com/njraladdin/proposal-copycat', '_blank')}>
                  Visit GitHub Project
                  <Github className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white border-y">
          <div className="container relative px-4 md:px-6 mx-auto">
            <div className="text-center max-w-[800px] mx-auto mb-24">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                The extension scrapes your successful Upwork proposals and uses them to generate winning proposals 
                in your style through careful AI prompting.
              </p>
            </div>
            
            <div className="relative h-[400px]" ref={containerRef}>
              {/* Source Proposals */}
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  ref={proposalRefs[i]}
                  className="absolute left-[10%] transform -translate-x-1/2"
                  style={{ top: `${15 + i * 20}%`, zIndex: 10 }}
                >
                  <div className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-20 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm border border-blue-200/20 shadow-lg flex flex-col items-center justify-center transition-all hover:scale-105">
                    <FileText className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-600 mb-1 sm:mb-2" />
                    <span className="text-[10px] sm:text-xs md:text-sm text-blue-600 font-medium">Proposal</span>
                  </div>
                </div>
              ))}

              {/* AI Circle */}
              <div 
                ref={aiRef}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                style={{ zIndex: 10 }}
              >
                <img 
                  src="/android-chrome-512x512.png"
                  alt="Proposal Copycat Logo" 
                  className="w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 object-contain transition-all hover:scale-105"
                />
              </div>

              {/* Output Proposal */}
              <div 
                ref={outputRef}
                className="absolute right-[10%] top-1/2 transform translate-x-1/2 -translate-y-1/2"
                style={{ zIndex: 10 }}
              >
                <div className="w-16 sm:w-20 md:w-28 h-16 sm:h-20 md:h-24 rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br from-[#14a800]/10 to-[#14a800]/10 backdrop-blur-sm border border-[#14a800]/20 shadow-lg flex flex-col items-center justify-center transition-all hover:scale-105">
                  <FileText className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8 text-[#14a800] mb-1 sm:mb-2" />
                  <span className="text-[10px] sm:text-xs md:text-sm text-[#14a800] font-medium text-center leading-tight">
                    New<br/>Proposal
                  </span>
                </div>
              </div>

              {/* Animated Beams */}
              {mounted && (
                <>
                  {proposalRefs.map((fromRef, i) => (
                    <AnimatedBeam
                      key={i}
                      containerRef={containerRef}
                      fromRef={fromRef}
                      toRef={aiRef}
                      curvature={50}
                      duration={2}
                      delay={i * 0.3}
                      gradientStartColor="rgba(59, 130, 246, 0.5)"
                      gradientStopColor="rgba(99, 102, 241, 0.5)"
                    />
                  ))}
                  <AnimatedBeam
                    containerRef={containerRef}
                    fromRef={aiRef}
                    toRef={outputRef}
                    curvature={50}
                    duration={2}
                    delay={1.5}
                    gradientStartColor="rgba(16, 185, 129, 0.5)"
                    gradientStopColor="rgba(5, 150, 105, 0.5)"
                    reverse={true}
                  />
                </>
              )}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 border-y">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
            <div className="max-w-[800px] mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-8">
                Simple Workflow
              </h2>
              <p className="text-lg text-gray-600 mb-12">
                Generate proposals that match your writing style in seconds instead of spending 30+ minutes writing from scratch.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <span className="text-4xl mb-4">1️⃣ 📥</span>
                  <h3 className="text-xl font-semibold mb-2">Collect History</h3>
                  <p className="text-gray-500">
                    Extension automatically scrapes your successful Upwork proposals and job descriptions
                  </p>
                </div>
                <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <span className="text-4xl mb-4">2️⃣ 👤</span>
                  <h3 className="text-xl font-semibold mb-2">Add Portfolio</h3>
                  <p className="text-gray-500">
                    Provide your portfolio details to help AI understand your experience and expertise
                  </p>
                </div>
                <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                  <span className="text-4xl mb-4">3️⃣ 🤖</span>
                  <h3 className="text-xl font-semibold mb-2">Generate & Paste</h3>
                  <p className="text-gray-500">
                    Click generate, copy the AI-optimized prompt, and paste into ChatGPT for instant proposals
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white border-y">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-16">
              Effortless Proposal Creation
            </h2>
            <div className="grid md:grid-cols-2 gap-12 max-w-[800px] mx-auto">
              <ComparisonCard
                icon={Clock}
                label="Before"
                time="30 minutes"
                description="Manually crafting each proposal"
                variant="before"
              />
              <ComparisonCard
                icon={Zap}
                label="After"
                time="5 seconds"
                description="AI generates proposals in your style"
                variant="after"
              />
            </div>
          </div>
        </section>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 border-y">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="max-w-[800px] mx-auto">
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="bg-white rounded-lg shadow-sm border">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    How exactly does this work with ChatGPT?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    The extension generates a comprehensive prompt that includes your past successful proposals, portfolio details, and the current job requirements. You simply copy this optimized prompt and paste it into ChatGPT, which then generates a proposal that matches your proven writing style and success patterns.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="bg-white rounded-lg shadow-sm border">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    Do I need a ChatGPT subscription?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    No, you don't need a paid subscription! You can use any AI service like ChatGPT (free version), Claude, or other AI chat models. The extension focuses on creating the perfect prompt - you can paste this into any AI chat service to generate your proposal.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="bg-white rounded-lg shadow-sm border">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    How many successful proposals do I need for good results?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    The extension works best with at least 3-5 successful proposals, but even one winning proposal can help. Each successful proposal helps ChatGPT better understand your winning patterns and style. We also recommend adding your portfolio details to enhance the generated prompts.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" className="bg-white rounded-lg shadow-sm border">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    What's included in the generated prompt?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    The prompt includes your past winning proposals, their corresponding job descriptions, your portfolio highlights, and carefully crafted instructions that help ChatGPT understand your writing style and success patterns. It's specifically formatted to help ChatGPT generate proposals that sound authentic to your voice.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="bg-white rounded-lg shadow-sm border">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    How long does the whole process take?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    The entire process takes about 2-3 minutes: 30 seconds for the extension to analyze the job and generate your custom prompt, and 1-2 minutes to paste it into ChatGPT and get your proposal. This is significantly faster than writing proposals from scratch, which typically takes 15-30 minutes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6" className="bg-white rounded-lg shadow-sm border">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    What if I don't have any successful proposals yet?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    The extension can still help! It will generate a prompt focusing on your portfolio details and professional background. As you win jobs, you can add those proposals to improve the quality of the generated prompts, leading to even better results from ChatGPT.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto max-w-[1200px] px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6 max-w-[800px] mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to boost your Upwork success?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Start crafting winning proposals with the power of AI today.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Button
                  size="lg"
                  style={{ backgroundColor: '#14a800', color: 'white' }}
                  className="hover:bg-[#14a800]/90"
                >
                  Get Chrome Extension
                  <Chrome className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
        <div className="flex items-center gap-2">
          <Logo size="small" />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            © 2024 Proposal Copycat. All rights reserved.
          </p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="/privacy-policy.html">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

export default function App() {
  return <LandingPage />
}
