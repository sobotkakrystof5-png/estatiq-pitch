import type { ReactNode } from 'react';

/**
 * Minimální notebook: tenká linka kolem displeje 16:10 a pod ním jedna delší linka
 * jako hrana spodku. Žádné odlesky, stíny ani kamera. Uvnitř screenshot nebo Placeholder.
 */
export function LaptopFrame({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-full rounded-[22px] border-2 border-line p-[14px]">
        <div className="aspect-[16/10] w-full overflow-hidden rounded-[8px] bg-night-2">
          {children}
        </div>
      </div>
      <div className="mt-[10px] h-[2px] w-[114%] rounded-full bg-line" />
    </div>
  );
}
