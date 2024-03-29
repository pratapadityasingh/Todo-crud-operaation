import Image from "next/image";
import { Inter } from "next/font/google";
import Home from "@/components/Home";

const inter = Inter({ subsets: ["latin"] });

export default function MyApp() {
  return (
  <Home />
  );
}
