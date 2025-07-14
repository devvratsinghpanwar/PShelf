import { cn } from "@/lib/utils";
import ProductDisplay from "../productDisplay";

export function GridBackgroundDemo() {
  return (
    <div className="relative flex h-[50rem] w-full items-center justify-center bg-[#0A1828]">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#1F3244_1px,transparent_1px),linear-gradient(to_bottom,#1F3244_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#142437_1px,transparent_1px),linear-gradient(to_bottom,#142437_1px,transparent_1px)]"
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#0A1828] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <ProductDisplay/>
    </div>
  );
}
