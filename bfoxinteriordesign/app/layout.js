import "./globals.css";

export const metadata = {
  title: "Brooklyn Fox Interior Design",
  description: "Portfolio of Brooklyn Fox Interior Design projects",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
