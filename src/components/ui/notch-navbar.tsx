"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Home,
  Sparkles,
  Scissors,
  MapPin,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import LogoIcon from "@/assets/logo/logo-icon"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

const NavLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}) => (
  <Link
    href={href}
    className="group flex items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-[#e60073] dark:text-zinc-200 dark:hover:text-[#ff3b9a] transition-colors whitespace-nowrap"
  >
    <Icon className="w-4 h-4 text-[#e60073] dark:text-[#ff3b9a] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
    <span>{label}</span>
  </Link>
)

const MobileThemeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="w-8 h-8" />

  const isDark = theme === "dark" || resolvedTheme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#e60073]/10 transition-colors text-zinc-700 dark:text-zinc-200 hover:text-[#e60073]"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}

export function NotchNavbar({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { logo?: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const items = {
    left: [
      { label: "Home", href: "#home", icon: Home },
      { label: "Our Products", href: "#services", icon: Sparkles },
      { label: "Haircuts", href: "#haircuts", icon: Scissors },
    ],
    right: [{ label: "Studio Map", href: "#location", icon: MapPin }],
  }

  return (
    <>
      <header
        className={cn("fixed top-0 inset-x-0 z-[500] isolate h-[68px] flex px-0", className)}
        {...props}
      >
        {/* Left Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-white/95 dark:bg-[#09060d]/95 backdrop-blur-md z-20 relative min-w-0">
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="39.5"
              x2="100%"
              y2="39.5"
              stroke="#e60073"
              strokeOpacity={0.38}
              strokeWidth={1}
            />
            <line
              x1="0"
              y1="36.5"
              x2="100%"
              y2="36.5"
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={0.6}
              className="text-foreground"
            />
          </svg>
        </div>

        {/* Responsive Notch Container - 3 Slices */}
        <div className="flex h-[68px] relative z-10 shrink-0 -ml-px">
          {/* Left Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0">
            <div
              className="absolute inset-0 bg-white/95 dark:bg-[#09060d]/95 backdrop-blur-md"
              style={{
                clipPath: "path('M0 0 H50 V68 C25 68 25 40 0 40 Z')",
              }}
            />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 50 68"
            >
              <path
                d="M0 39.5 C25 39.5 25 67.5 50 67.5"
                fill="none"
                stroke="#e60073"
                strokeOpacity={0.45}
                strokeWidth={1.1}
              />
              <path
                d="M0 36.5 C25 36.5 25 64.5 50 64.5"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={0.6}
                className="text-foreground"
              />
            </svg>
          </div>

          {/* Center Slice (Flexible Content Area) */}
          <div className="flex-1 h-full relative min-w-0 -ml-px">
            {/* Background & Lines Layer */}
            <div className="absolute inset-0 bg-white/95 dark:bg-[#09060d]/95 backdrop-blur-md">
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                preserveAspectRatio="none"
              >
                <line
                  x1="0"
                  y1="67.5"
                  x2="100%"
                  y2="67.5"
                  stroke="#e60073"
                  strokeOpacity={0.5}
                  strokeWidth={1.1}
                />
                <line
                  x1="0"
                  y1="64.5"
                  x2="100%"
                  y2="64.5"
                  stroke="currentColor"
                  strokeOpacity={0.08}
                  strokeWidth={0.6}
                  className="text-foreground"
                />
              </svg>
            </div>

            {/* Content Layer */}
            <div className="relative w-full h-full flex items-center justify-between px-4 md:px-8 pt-0.5">
              {/* Desktop Left Nav */}
              <nav
                className="hidden md:flex h-10 items-center gap-7 shrink-0"
                aria-label="Left navigation"
              >
                {items.left.map((item) => (
                  <NavLink key={item.label} {...item} />
                ))}
              </nav>

              {/* Mobile Menu Button (Left) */}
              <div className="flex md:hidden h-10 items-center">
                <button
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#e60073]/10 text-zinc-700 dark:text-zinc-200 hover:text-[#e60073] transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Official BLOSSOM Logo (Centerpiece) */}
              <div className="flex h-10 items-center justify-center shrink-0 mx-3 md:mx-6">
                {props.logo || (
                  <Link
                    href="#home"
                    aria-label="Blossom Unisex Salon"
                    data-testid="navbar-blossom-logo"
                    className="group relative flex items-center justify-center transition-transform duration-300 hover:scale-105"
                  >
                    {/* Light Mode: Obsidian Black Letters + Hot-Pink Lotus O */}
                    <LogoIcon
                      variant="obsidian"
                      className="h-6 sm:h-7 md:h-[32px] w-auto block dark:hidden drop-shadow-[0_2px_8px_rgba(230,0,115,0.18)]"
                    />
                    {/* Dark Mode (on Black Navbar): Crisp Pearl Letters + Hot-Pink Lotus O */}
                    <LogoIcon
                      variant="light"
                      className="h-6 sm:h-7 md:h-[32px] w-auto hidden dark:block drop-shadow-[0_2px_12px_rgba(240,18,122,0.34)]"
                    />
                  </Link>
                )}
              </div>

              {/* Desktop Right Nav */}
              <nav
                className="hidden md:flex h-10 gap-6 items-center shrink-0"
                aria-label="Right navigation"
              >
                {items.right.map((item) => (
                  <NavLink key={item.label} {...item} />
                ))}

                <div className="flex h-9 gap-3.5 pl-4 border-l border-zinc-200 dark:border-zinc-800 shrink-0 items-center">
                  <ThemeToggle />
                  <Link
                    href="#haircuts"
                    className="group inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#1b0829] via-[#2d0c42] to-[#e60073] hover:from-[#e60073] hover:to-[#b8005c] rounded-full transition-all duration-300 shadow-[0_2px_14px_rgba(230,0,115,0.3)] whitespace-nowrap"
                  >
                    <span>Book Session</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </nav>

              {/* Mobile Right Actions */}
              <div className="flex md:hidden h-10 items-center">
                <MobileThemeToggle />
              </div>
            </div>
          </div>

          {/* Right Slice (Corner) */}
          <div className="w-[50px] h-full relative shrink-0 -ml-px">
            <div
              className="absolute inset-0 bg-white/95 dark:bg-[#09060d]/95 backdrop-blur-md"
              style={{
                clipPath: "path('M0 0 H50 V40 C25 40 25 68 0 68 Z')",
              }}
            />
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 50 68"
            >
              <path
                d="M0 67.5 C25 67.5 25 39.5 50 39.5"
                fill="none"
                stroke="#e60073"
                strokeOpacity={0.45}
                strokeWidth={1.1}
              />
              <path
                d="M0 64.5 C25 64.5 25 36.5 50 36.5"
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.08}
                strokeWidth={0.6}
                className="text-foreground"
              />
            </svg>
          </div>
        </div>

        {/* Right Side Bar - Flexible width */}
        <div className="flex-1 h-10 bg-white/95 dark:bg-[#09060d]/95 backdrop-blur-md z-20 relative min-w-0 -ml-px">
          <svg
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="39.5"
              x2="100%"
              y2="39.5"
              stroke="#e60073"
              strokeOpacity={0.38}
              strokeWidth={1}
            />
            <line
              x1="0"
              y1="36.5"
              x2="100%"
              y2="36.5"
              stroke="currentColor"
              strokeOpacity={0.08}
              strokeWidth={0.6}
              className="text-foreground"
            />
          </svg>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[68px] z-[490] bg-white dark:bg-[#09060d] border-b border-[#e60073]/25 p-4 md:hidden shadow-lg"
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {[...items.left, ...items.right].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#e60073]/10 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5 text-[#e60073]" />
                  <span className="font-medium text-foreground/90">
                    {item.label}
                  </span>
                </Link>
              ))}
              <div className="h-px bg-foreground/10 my-2" />
              <div className="flex flex-col gap-2">
                <Link
                  href="#haircuts"
                  className="flex items-center justify-center gap-2 p-3 rounded-full bg-gradient-to-r from-[#1b0829] to-[#e60073] text-white font-semibold text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Book Session</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
