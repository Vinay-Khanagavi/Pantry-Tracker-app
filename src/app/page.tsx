import Image from "next/image";
import { Pantry } from "@/components/component/pantry";
import { FirstPage } from "@/components/component/FirstPage";

export default function Home() {
  return (
    <div>
      <FirstPage />
      <Pantry />
    </div>
  );
}
