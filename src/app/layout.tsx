import type { Metadata, Viewport } from "next";
import { Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import { AuthProviderWrapper } from "@/components/auth-provider";
import "./globals.css";

const bengaliSans = Noto_Sans_Bengali({
  variable: "--font-bengali-sans",
  subsets: ["bengali", "latin"],
  display: "swap",
  weight: "variable",
});

const bengaliSerif = Noto_Serif_Bengali({
  variable: "--font-bengali-serif",
  subsets: ["bengali", "latin"],
  display: "swap",
  weight: "variable",
});

const themeInit = `(function(){try{var t=localStorage.getItem("anucched-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark";}catch(e){document.documentElement.dataset.theme="dark";}})();`;

export const metadata: Metadata = {
  title: {
    default: "অনুচ্ছেদ — বইয়ের সারসংক্ষেপ",
    template: "%s | অনুচ্ছেদ",
  },
  description:
    "বাছাই করা বইয়ের গভীর সারসংক্ষেপ, এক বসে পড়ার জন্য। সময় বাঁচান, ভাবনার গভীরে যান।",
  applicationName: "অনুচ্ছেদ",
  keywords: [
    "বইয়ের সারসংক্ষেপ",
    "বাংলা বই",
    "book summary",
    "Bengali books",
    "অনুচ্ছেদ",
  ],
  openGraph: {
    title: "অনুচ্ছেদ — বইয়ের সারসংক্ষেপ",
    description:
      "বাছাই করা বইয়ের গভীর সারসংক্ষেপ, এক বসে পড়ার জন্য।",
    locale: "bn_BD",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#071a1f" },
    { media: "(prefers-color-scheme: light)", color: "#eef2ed" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${bengaliSans.variable} ${bengaliSerif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-dvh bg-paper font-body text-ink">
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  );
}
