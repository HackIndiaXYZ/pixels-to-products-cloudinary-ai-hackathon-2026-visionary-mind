import "./globals.css";

export const metadata = {
  title: "Pixels to Products — AI Photoshoot Studio",
  description:
    "Turn one product photo into a full set of studio-quality marketing images with Cloudinary AI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
