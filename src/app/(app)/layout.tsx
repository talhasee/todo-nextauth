import { Inter } from "next/font/google";
import Navbar from '@/components/Navbar';


interface RootLayoutProps {
  children: React.ReactNode;
}
const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className={`flex flex-col min-h-screen min-w-full ${inter.className}`}>
      <Navbar />
      {children}
    </div>
  );
}