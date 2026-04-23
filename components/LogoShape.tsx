export const LogoShape = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M100 0C155 0 200 45 200 100C200 155 155 200 100 200C45 200 0 155 0 100C0 45 45 0 100 0Z" />
      <path
        d="M60 0L100 70L140 0Z"
        fill="purple"
      />
    </svg>
  );
};