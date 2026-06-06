import { useId } from "react";

export type IconProps = { size?: number; className?: string };

const base = ({ size = 18, className }: IconProps) => ({
  width: size,
  height: size,
  className,
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
  "aria-hidden": true as const,
});

export function IconChevronLeft({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base({ size, className })}>
      <path
        d="M15 6l-6 6 6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconChevronRight({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base({ size, className })}>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMore({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base({ size, className })}>
      <circle cx="5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

/** Ручка перетаскивания (две колонки точек) */
export function IconReorder({ size, className }: IconProps) {
  const dots = [
    [8, 7],
    [8, 12],
    [8, 17],
    [16, 7],
    [16, 12],
    [16, 17],
  ];
  return (
    <svg viewBox="0 0 24 24" {...base({ size, className })}>
      {dots.map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.75" fill="currentColor" />
      ))}
    </svg>
  );
}

export function IconClose({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base({ size, className })}>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Квадрат «стоп» для плашки таймера (как в макете) */
export function IconStop({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base({ size, className })}>
      <rect x="5.5" y="5.5" width="13" height="13" rx="2.5" fill="currentColor" />
    </svg>
  );
}

/** Иконка «Заменить» (replace.svg) */
export function IconEdit({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base({ size, className })}>
      <path
        d="M4 20h4l10.5-10.5a2.12 2.12 0 00-3-3L5 17v3zM14.5 6.5l3 3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function IconTrash({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base({ size, className })}>
      <path
        d="M4 7h16M10 11v6M14 11v6M6 7l1 12a1 1 0 001 1h8a1 1 0 001-1l1-12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function IconReplace({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" {...base({ size, className })}>
      <path
        d="M5.7 9C6.1 7 7.9 5.5 10 5.5C11.5 5.5 12.7 6.2 13.5 7.3L15.2 5.3C14 3.9 12.1 3 10 3C6.5 3 3.6 5.6 3.1 9H1L4.5 13L8 9H5.7ZM15.5 7L12 11H14.3C13.8 13 12.1 14.5 10 14.5C8.5 14.5 7.3 13.8 6.5 12.7L4.8 14.6C6 16.1 7.9 17 10 17C13.5 17 16.4 14.4 16.9 11H19L15.5 7Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Иконка «Техника» (play.svg) */
export function IconPlay({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" {...base({ size, className })}>
      <path
        d="M16.8692 8.12009C17.2105 8.30156 17.4959 8.57247 17.695 8.90377C17.8941 9.23508 17.9992 9.6143 17.9992 10.0008C17.9992 10.3873 17.8941 10.7665 17.695 11.0978C17.4959 11.4291 17.2105 11.7001 16.8692 11.8815L7.76621 16.8316C6.30043 17.6295 4.5 16.5922 4.5 14.9516V5.0507C4.5 3.40942 6.30043 2.37279 7.76621 3.16927L16.8692 8.12009Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconList({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base({ size, className })}>
      <path
        d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSettings({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base({ size, className })}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.2793 2.152C13.9093 2 13.4393 2 12.5003 2C11.5613 2 11.0923 2 10.7213 2.152C10.4772 2.25175 10.2552 2.39878 10.0682 2.58465C9.88109 2.77051 9.73263 2.99154 9.63132 3.235C9.53732 3.458 9.50132 3.719 9.48632 4.098C9.47918 4.3725 9.40238 4.64068 9.26314 4.87736C9.1239 5.11403 8.92679 5.31142 8.69032 5.451C8.44906 5.5851 8.17786 5.65615 7.90184 5.65754C7.62582 5.65894 7.35392 5.59065 7.11132 5.459C6.77332 5.281 6.52832 5.183 6.28632 5.151C5.7569 5.08192 5.22158 5.2242 4.79632 5.547C4.47832 5.789 4.24332 6.193 3.77432 7C3.30432 7.807 3.07032 8.21 3.01732 8.605C2.94732 9.131 3.09132 9.663 3.41732 10.084C3.56532 10.276 3.77432 10.437 4.09732 10.639C4.57432 10.936 4.88032 11.442 4.88032 12C4.88032 12.558 4.57432 13.064 4.09832 13.36C3.77432 13.563 3.56532 13.724 3.41632 13.916C3.25588 14.1242 3.13806 14.362 3.0696 14.6158C3.00114 14.8696 2.98337 15.1343 3.01732 15.395C3.07032 15.789 3.30432 16.193 3.77432 17C4.24432 17.807 4.47832 18.21 4.79632 18.453C5.22032 18.776 5.75632 18.918 6.28632 18.849C6.52832 18.817 6.77332 18.719 7.11132 18.541C7.35404 18.4092 7.62613 18.3408 7.90234 18.3422C8.17855 18.3436 8.44994 18.4147 8.69132 18.549C9.17732 18.829 9.46532 19.344 9.48632 19.902C9.50132 20.282 9.53732 20.542 9.63132 20.765C9.83532 21.255 10.2273 21.645 10.7213 21.848C11.0913 22 11.5613 22 12.5003 22C13.4393 22 13.9093 22 14.2793 21.848C14.5234 21.7483 14.7454 21.6012 14.9325 21.4154C15.1195 21.2295 15.268 21.0085 15.3693 20.765C15.4633 20.542 15.4993 20.282 15.5143 19.902C15.5343 19.344 15.8233 18.828 16.3103 18.549C16.5516 18.4149 16.8228 18.3439 17.0988 18.3425C17.3748 18.3411 17.6467 18.4093 17.8893 18.541C18.2273 18.719 18.4723 18.817 18.7143 18.849C19.2443 18.919 19.7803 18.776 20.2043 18.453C20.5223 18.211 20.7573 17.807 21.2263 17C21.6963 16.193 21.9303 15.79 21.9833 15.395C22.0171 15.1343 21.9992 14.8695 21.9306 14.6157C21.8619 14.3619 21.7439 14.1241 21.5833 13.916C21.4353 13.724 21.2263 13.563 20.9033 13.361C20.4263 13.064 20.1203 12.558 20.1203 12C20.1203 11.442 20.4263 10.936 20.9023 10.64C21.2263 10.437 21.4353 10.276 21.5843 10.084C21.7447 9.87579 21.8626 9.63799 21.931 9.38422C21.9995 9.13044 22.0173 8.86565 21.9833 8.605C21.9303 8.211 21.6963 7.807 21.2263 7C20.7563 6.193 20.5223 5.79 20.2043 5.547C19.779 5.2242 19.2437 5.08192 18.7143 5.151C18.4723 5.183 18.2273 5.281 17.8893 5.459C17.6466 5.59083 17.3745 5.65922 17.0983 5.65782C16.8221 5.65642 16.5507 5.58528 16.3093 5.451C16.073 5.3113 15.8761 5.11385 15.7371 4.87719C15.598 4.64052 15.5213 4.37241 15.5143 4.098C15.4993 3.718 15.4633 3.458 15.3693 3.235C15.268 2.99154 15.1195 2.77051 14.9325 2.58465C14.7454 2.39878 14.5234 2.25175 14.2793 2.152ZM12.5003 15C14.1703 15 15.5233 13.657 15.5233 12C15.5233 10.343 14.1693 9 12.5003 9C10.8313 9 9.47732 10.343 9.47732 12C9.47732 13.657 10.8313 15 12.5003 15Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconCheck({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base({ size, className })}>
      <path
        d="M6 12l4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Индикатор нагрузки (3 полоски) */
export function IconSignalBars({
  size = 18,
  className,
  activeCount = 3,
  activeColor = "currentColor",
  inactiveColor = "rgba(255, 255, 255, 0.22)",
}: IconProps & {
  activeCount?: 1 | 2 | 3;
  activeColor?: string;
  inactiveColor?: string;
}) {
  const bars = [
    { x: 1, h: 5 },
    { x: 6, h: 8 },
    { x: 11, h: 11 },
  ];

  return (
    <svg
      viewBox="0 0 16 14"
      width={size}
      height={Math.round(size * (14 / 16))}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {bars.map((bar, index) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={14 - bar.h}
          width={3.5}
          height={bar.h}
          rx={1}
          fill={index < activeCount ? activeColor : inactiveColor}
        />
      ))}
    </svg>
  );
}

/** solar_fire-bold.svg — иконка серии тренировок */
export function IconSolarFireBold({ size = 20, className }: IconProps) {
  const filterId = useId().replace(/:/g, "");
  const resolvedSize = size ?? 20;
  const height = Math.round(resolvedSize * (65 / 61));
  const flamePath =
    "M32.3867 48.0791C37.5967 47.0358 44.3333 43.2874 44.3333 33.5958C44.3333 24.7774 37.8783 18.9041 33.2367 16.2058C32.205 15.6058 31 16.3941 31 17.5858V20.6324C31 23.0358 29.99 27.4224 27.1833 29.2474C25.75 30.1791 24.2 28.7841 24.0267 27.0841L23.8833 25.6874C23.7167 24.0641 22.0633 23.0791 20.7667 24.0691C18.435 25.8441 16 28.9608 16 33.5941C16 45.4458 24.815 48.4108 29.2217 48.4108C29.4794 48.4108 29.7483 48.4025 30.0283 48.3858C27.8517 48.2008 24.3333 46.8508 24.3333 42.4841C24.3333 39.0674 26.825 36.7591 28.7183 35.6341C29.2283 35.3341 29.8233 35.7258 29.8233 36.3174V37.3008C29.8233 38.0508 30.115 39.2258 30.8067 40.0291C31.59 40.9391 32.7383 39.9858 32.83 38.7891C32.86 38.4124 33.24 38.1724 33.5667 38.3624C34.635 38.9874 36 40.3208 36 42.4841C36 45.8974 34.1183 47.4674 32.3867 48.0791Z";

  return (
    <svg
      viewBox="0 0 61 65"
      width={resolvedSize}
      height={height}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path d={flamePath} fill="var(--hub-streak-accent, #c4ff62)" />
      <g filter={`url(#${filterId})`}>
        <path
          d={flamePath}
          fill="var(--hub-streak-accent, #c4ff62)"
          fillOpacity="0.5"
        />
      </g>
      <defs>
        <filter
          id={filterId}
          x="0"
          y="0"
          width="60.3333"
          height="64.4108"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur stdDeviation="8" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
}

export function IconSync({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base({ size, className })}>
      <path
        d="M12 6V3L8 7l4 4V8c2.2 0 4 1.8 4 4a4 4 0 01-4 4 4 4 0 01-3.5-2.1M12 18v3l4-4-4-4v3a4 4 0 00-4-4 4 4 0 014-4 4 4 0 013.5 2.1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconExclamation({ size, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...base({ size, className })}>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M12 8v5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="1.25" fill="currentColor" />
    </svg>
  );
}
