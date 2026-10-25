import Image from "next/image";
import bridge from "@/assets/bear-canyon-bridge.jpg";

export function BridgeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#071018]">
      <div className="home-parallax absolute inset-0">
        <div className="ken-burns absolute -inset-[8%]">
          <Image
            src={bridge}
            alt=""
            fill
            preload
            placeholder="blur"
            quality={70}
            sizes="100vw"
            className="bridge-photo object-cover object-[50%_46%]"
          />
        </div>
      </div>
      <div className="home-scrim absolute inset-0" />
      <div className="home-vignette absolute inset-0" />
      <div className="home-spotlight absolute inset-0" />
    </div>
  );
}
