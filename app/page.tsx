import Image from "next/image";
import SectionOne from "./components/HomePage/Section1/SectionOne";
import SectionTwo from "./components/HomePage/section2/SectionTwo";
import SectionThree from "./components/HomePage/Section3/SectionThree";
import SectionFour from "./components/HomePage/section4/SectionFour";

export default function Home() {
  return (
    <div className="w-full">
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
    </div>
  );
}