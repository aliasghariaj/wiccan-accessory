type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({
  children,
  className = "",
}: ContainerProps) {
  return (
    <div
      className={`
        relative
        mx-auto
        w-full
        max-w-7xl
        px-6
        lg:px-10
        ${className}
      `}
    >
      {children}
    </div>
  );
}