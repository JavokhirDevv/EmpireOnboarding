import Image from "next/image";

export function EmpireLogo({
  className = "",
  dark = false,
}: {
  className?: string;
  dark?: boolean;
}) {
  const textColor = dark ? "text-white" : "text-navy-900";
  const subColor = dark ? "text-accent-400" : "text-accent-600";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo.png"
        alt="Empire National"
        width={36}
        height={36}
        className="shrink-0"
        priority
      />
      <div className="leading-tight">
        <div className={`font-bold tracking-tight text-lg ${textColor}`}>
          Empire National
        </div>
        <div className={`text-[11px] font-semibold tracking-[0.16em] uppercase ${subColor}`}>
          Dispatcher Onboarding
        </div>
      </div>
    </div>
  );
}
