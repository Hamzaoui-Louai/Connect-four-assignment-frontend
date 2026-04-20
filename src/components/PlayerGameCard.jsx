const BotIcon = ({ color = '#333', size = 300 }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      style={{ color }}
    >
      <defs>
        <mask id="face">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          {/* Eyes */}
          <circle cx="38" cy="40" r="6" fill="black" />
          <circle cx="62" cy="40" r="6" fill="black" />
          {/* Mouth bars */}
          <rect x="38" y="54" width="4" height="12" rx="2" fill="black" />
          <rect x="46" y="54" width="4" height="12" rx="2" fill="black" />
          <rect x="54" y="54" width="4" height="12" rx="2" fill="black" />
          <rect x="62" y="54" width="4" height="12" rx="2" fill="black" />
        </mask>
      </defs>

      {/* Left ear */}
      <rect x="4" y="36" width="12" height="20" rx="4" fill="currentColor" />

      {/* Right ear */}
      <rect x="84" y="36" width="12" height="20" rx="4" fill="currentColor" />

      {/* Antenna */}
      <rect x="48" y="8" width="4" height="12" rx="2" fill="currentColor" />
      <circle cx="50" cy="6" r="4" fill="currentColor" />

      {/* Head with cutouts */}
      <rect
        x="20"
        y="18"
        width="60"
        height="56"
        rx="12"
        fill="currentColor"
        mask="url(#face)"
      />
    </svg>
  );
};

const UserIcon = ({ color = '#333', size = 300 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 7C9.65685 7 11 5.65685 11 4C11 2.34315 9.65685 1 8 1C6.34315 1 5 2.34315 5 4C5 5.65685 6.34315 7 8 7Z"
        fill={color}
      />
      <path
        d="M14 12C14 10.3431 12.6569 9 11 9H5C3.34315 9 2 10.3431 2 12V15H14V12Z"
        fill={color}
      />
    </svg>
  );
};

function PlayerGameCard({ isPlayer , isOnTurn }) {
  const glowClass = isPlayer ? "card-glow card-glow-player" : "card-glow card-glow-bot";

    return (
    <div className="relative h-40 w-40">
      <div className={isOnTurn ? glowClass : ""} />
      <div className="relative z-10 h-full w-full rounded-4xl bg-[#1e1e1e] flex items-center justify-center pt-2.5">
        {
          isPlayer ? <UserIcon size={120} color="#555"/> : <BotIcon size={120} color="#555"/>
        }
      </div>
    </div>
    )
}

export default PlayerGameCard