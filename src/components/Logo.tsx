const Logo = () => {
  return (
    <span className="flex flex-col items-center">
      <span
        style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)" }}
        className="text-2xl font-bold leading-5 tracking-wide text-slate-700"
      >
        FI
      </span>
      <span className="text-xs text-slate-800">Find It</span>
    </span>
  );
};

export default Logo;
