type BrandLogoProps = {
  variant?: "compact" | "full";
  className?: string;
  eager?: boolean;
};

export function BrandLogo({
  variant = "compact",
  className = "",
  eager = false,
}: BrandLogoProps) {
  if (variant === "full")
    return (
      <img
        src="/assets/pythonpro-logo.png"
        alt="PythonPro — Learn, Practice, Master"
        width={900}
        height={900}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        className={`h-auto w-full object-contain ${className}`}
      />
    );
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src="/assets/pythonpro-icon.png"
        alt=""
        aria-hidden="true"
        width={512}
        height={512}
        loading={eager ? "eager" : "lazy"}
        className="h-10 w-10 shrink-0 rounded-xl object-contain"
      />
      <span className="text-xl font-black tracking-tight text-[#061a37] dark:text-white">
        Python<span className="text-[#1267c8]">Pro</span>
      </span>
    </span>
  );
}
