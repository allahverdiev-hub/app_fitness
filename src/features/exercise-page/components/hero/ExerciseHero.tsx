import styles from "./ExerciseHero.module.css";

type ExerciseHeroProps = {
  imageSrc: string;
  videoSrc?: string;
  alt?: string;
  fill?: boolean;
  className?: string;
};

export function ExerciseHero({
  imageSrc,
  videoSrc,
  alt = "Иллюстрация упражнения с выделением мышц",
  fill = false,
  className,
}: ExerciseHeroProps) {
  const rootClass = [
    styles.hero,
    fill ? styles.heroFill : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const mediaWrapClass = fill ? styles.mediaWrapFill : styles.imageWrap;
  const mediaClass = fill ? styles.mediaFill : styles.image;

  return (
    <div className={rootClass}>
      <div className={mediaWrapClass}>
        {videoSrc ? (
          <video
            className={mediaClass}
            src={videoSrc}
            poster={imageSrc}
            playsInline
            muted
            loop
            autoPlay
            aria-label={alt}
          />
        ) : (
          <img src={imageSrc} alt={alt} className={mediaClass} />
        )}
      </div>
    </div>
  );
}
