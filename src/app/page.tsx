import Image from "next/image";
import Template from "./template/page";

export default function Home() {
  return (
    <div className="w-full mx-auto px-3 py-6">
      <div className="md:w-1/2 mx-auto">
        <Template />
      </div>
    </div>
  );
}
