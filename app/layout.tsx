import './globals.css'
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn("font-sans", inter.variable)}>
      <body>
        {children}
      </body>
    </html>
  )
}
