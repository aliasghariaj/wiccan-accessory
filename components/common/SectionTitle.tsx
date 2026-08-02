type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  glow?: boolean;
};

export default function SectionTitle({
  eyebrow,
  title,
  glow = true,
}: SectionTitleProps) {
  return (
    <div className="mb-8 flex flex-col items-center">
      {eyebrow && (
        <p className="mb-4 uppercase tracking-[0.6em] text-yellow-600">
          {eyebrow}
        </p>
      )}

      <h2
        className={`
          text-5xl
          font-bold
          lg:text-7xl
          ${glow ? "drop-shadow-[0_0_25px_rgba(198,161,91,0.35)]" : ""}
        `}
      >
        {title}
      </h2>
    </div>
  );
}