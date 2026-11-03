/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotchNavbar } from "@/components/ui/notch-navbar"
import { SalonHero } from "@/components/salon-hero"
import { SalonServicesLookbook } from "@/components/salon-services-lookbook"
import FlipCardDock from "@/components/mfa/FlipCardDock"
import { HAIRCUT_DESIGNS } from "@/lib/haircut-dock-config"
import { SalonScrollFlyMap } from "@/components/salon-scroll-fly-map"
import { SalonFooter } from "@/components/salon-footer"
import { ThemeProvider } from "next-themes"

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <NotchNavbar />
        <main>
          <SalonHero />
          <SalonServicesLookbook />
          <div id="haircuts" className="relative isolate h-svh min-h-[640px] w-full border-t border-zinc-200 pt-[68px] dark:border-zinc-800/80 bg-zinc-50 dark:bg-[#0c0c0e]">
            <FlipCardDock people={HAIRCUT_DESIGNS} />
          </div>
          <SalonScrollFlyMap />
        </main>
        <SalonFooter />
      </div>
    </ThemeProvider>
  )
}
