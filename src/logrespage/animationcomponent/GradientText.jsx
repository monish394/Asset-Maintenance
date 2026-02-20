export default function GradientText({ 
  children,
  className = "",
  colors = ["#5227FF", "#FF9FFC", "#128112"],
  animationSpeed = 8,
}) {
  const gradient = `linear-gradient(270deg, ${colors.join(",")})`;

  return (
    <span
      className={`bg-clip-text text-transparent bg-[length:200%_200%] animate-gradient ${className}`}
      style={{
        backgroundImage: gradient,
        animation: `gradientMove ${animationSpeed}s ease infinite`,
      }}
    >
      {children}
    </span>
  );
}
