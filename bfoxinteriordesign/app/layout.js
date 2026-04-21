import { Poppins } from "next/font/google";
import "./globals.css";

// Poppins loads through next/font so it ships with the app — no trip out
// to Google, no flash of unstyled text on first paint. The --font-poppins
// CSS variable gets dropped onto <html> so Tailwind can use it by name.
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// ? Before launch: add an openGraph image + proper favicon set so the
// site looks like itself when someone drops the link in a chat.
export const metadata = {
  title: "Brooklyn Fox — Interior Designer",
  description:
    "Portfolio of Brooklyn Fox, Interior Designer. Three completed projects presented as a guided visual journey.",
};

// Wraps every page in the app. The wood-grain background is painted onto
// <body> in globals.css so it stays put when you click between pages —
// Next just swaps the content in the middle, no reload, no flicker.
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
