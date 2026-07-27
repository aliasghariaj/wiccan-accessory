type RealmButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export default function RealmButton({
  children,
  onClick,
}: RealmButtonProps) {
  return (
    <button
      onClick={onClick}
      className="
        mt-8
        rounded-xl
        border
        border-yellow-600
        bg-black/30
        px-8
        py-4
        text-white
        backdrop-blur-sm
        transition-all
        duration-300
        hover:scale-105
        hover:border-yellow-500
        hover:bg-yellow-700
        hover:text-black
        hover:shadow-[0_0_30px_rgba(198,161,91,0.55)]
      "
    >
      {children}
    </button>
  );
}