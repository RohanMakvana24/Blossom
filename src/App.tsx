/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotchNavbar } from "@/components/ui/notch-navbar"
import { SalonHero } from "@/components/salon-hero"
import { SalonServices } from "@/components/salon-services"
import { SalonServicesLookbook } from "@/components/salon-services-lookbook"
import { SalonFooter } from "@/components/salon-footer"
import { ThemeProvider } from "next-themes"

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <NotchNavbar />
        <main>
          <SalonHero />
          <SalonServices />
          <SalonServicesLookbook />
        </main>
        <SalonFooter />
      </div>
    </ThemeProvider>
  )
}
