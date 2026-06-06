import Image from 'next/image';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const iconSize = size === 'sm' ? 28 : 36;

  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt=""
        width={iconSize}
        height={iconSize}
        className="shrink-0"
        aria-hidden
      />
      <span className="text-headline-md font-semibold tracking-tight text-primary">Lifeport</span>
    </span>
  );
}
