type IconProps = {
  className?: string;
};

function Svg({
  className,
  children,
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? "size-6"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

export function BikeIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="6.2" cy="16.5" r="3" />
      <circle cx="17.8" cy="16.5" r="3" />
      <path d="M6.2 16.5 10 8.2h3.6l1.7 3.6h2.6" />
      <path d="M9.2 8.2 8 5.6" />
      <path d="M13.2 8.2 15.4 16.5" />
    </Svg>
  );
}

export function GamepadIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7 15.2c-1.7 1.5-3.2 2.1-3.8 1.2-.8-1.1.2-3.2 1.6-5.2 1.6-2.3 3.6-3.7 4.7-3.2 1 .4 1.2 2.6.6 5.1" />
      <path d="M17 15.2c1.7 1.5 3.2 2.1 3.8 1.2.8-1.1-.2-3.2-1.6-5.2-1.6-2.3-3.6-3.7-4.7-3.2-1 .4-1.2 2.6-.6 5.1" />
      <path d="M9.4 12.4h5.2" />
      <path d="M8.6 10.6v2.2M7.5 11.7h2.2" />
      <circle cx="15.4" cy="10.5" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="16.8" cy="11.8" r="0.6" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function ClockIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8.2V12l2.6 1.8" />
    </Svg>
  );
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <Svg className={className ?? "size-5"}>
      <path d="M5 12h14" />
      <path d="M13 6.5 18.5 12 13 17.5" />
    </Svg>
  );
}

export function WindIcon({ className }: IconProps) {
  return (
    <Svg className={className ?? "size-4"}>
      <path d="M4 8h9.5a2.2 2.2 0 1 0-2.1-2.8" />
      <path d="M4 12h13a2.2 2.2 0 1 1-2.1 2.8" />
      <path d="M4 16h7" />
    </Svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3.5v1.8M12 18.7v1.8M3.5 12h1.8M18.7 12h1.8M6 6l1.3 1.3M16.7 16.7 18 18M18 6l-1.3 1.3M7.3 16.7 6 18" />
    </Svg>
  );
}

export function CloudIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7.5 17.5h9.2a3.3 3.3 0 0 0 .4-6.6 4.6 4.6 0 0 0-8.8-1.2A3.4 3.4 0 0 0 7.5 17.5Z" />
    </Svg>
  );
}

export function CloudSunIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 4.2v1.4M16.6 6.2l-1 .9M8.4 6.2l1 .9M16.8 10h1.2" />
      <path d="M8 17.2h8.4a2.9 2.9 0 0 0 .3-5.8 4 4 0 0 0-7.6-1A3 3 0 0 0 8 17.2Z" />
    </Svg>
  );
}

export function FogIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M5 9.5h14M4 13h16M6 16.5h12" />
    </Svg>
  );
}

export function RainIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7.2 14.2h9.4a3.1 3.1 0 0 0 .3-6.2 4.2 4.2 0 0 0-8.1-1.1 3.2 3.2 0 0 0-1.6 7.3Z" />
      <path d="M8.5 16.4 7.6 19M12 16.4l-.9 2.6M15.5 16.4 14.6 19" />
    </Svg>
  );
}

export function SnowIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 3.5v17M5.2 7.2l13.6 9.6M18.8 7.2 5.2 16.8" />
      <path d="M12 7.2 10.4 5.6M12 7.2l1.6-1.6M12 16.8 10.4 18.4M12 16.8l1.6 1.6" />
    </Svg>
  );
}

export function StormIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M7.4 13.5h9.2A3.1 3.1 0 0 0 16.8 7a4.3 4.3 0 0 0-8.2-1 3.2 3.2 0 0 0-1.2 7.5Z" />
      <path d="M11.2 14.2 9.2 18.2h3.1L10.6 22" />
    </Svg>
  );
}

export function WeatherIcon({
  code,
  className,
}: IconProps & { code: number }) {
  if (code <= 1) return <SunIcon className={className} />;
  if (code === 2) return <CloudSunIcon className={className} />;
  if (code === 3) return <CloudIcon className={className} />;
  if (code <= 48) return <FogIcon className={className} />;
  if (code <= 67 || (code >= 80 && code <= 82)) {
    return <RainIcon className={className} />;
  }
  if (code <= 86) return <SnowIcon className={className} />;
  return <StormIcon className={className} />;
}
