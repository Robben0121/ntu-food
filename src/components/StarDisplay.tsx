export default function StarDisplay({
  rating,
  size = "text-base",
}: {
  rating: number;
  size?: string;
}) {
  const full = Math.round(rating);
  return (
    <span
      className={`${size} inline-flex leading-none`}
      aria-label={`${rating.toFixed(1)} 分`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= full ? "text-amber-400" : "text-stone-300"}>
          ★
        </span>
      ))}
    </span>
  );
}
