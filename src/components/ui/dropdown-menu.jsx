import React, { useState, useRef, useEffect } from "react";

export const DropdownMenu = ({ children }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { open, setOpen })
      )}
    </div>
  );
};

export const DropdownMenuTrigger = ({ children, asChild, open, setOpen }) => {
  const handleClick = () => setOpen && setOpen((o) => !o);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { onClick: handleClick });
  }
  return <div onClick={handleClick}>{children}</div>;
};

export const DropdownMenuContent = ({ children, align = "end", className = "", open, setOpen }) => {
  if (!open) return null;
  const alignClass = align === "end" ? "right-0" : "left-0";
  return (
    <div
      className={`absolute ${alignClass} mt-2 min-w-[10rem] origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/10 z-50 py-1 ${className}`}
    >
      {React.Children.map(children, (child) =>
        child && typeof child === "object"
          ? React.cloneElement(child, { setOpen })
          : child
      )}
    </div>
  );
};

export const DropdownMenuLabel = ({ children, className = "" }) => (
  <div className={`px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${className}`}>
    {children}
  </div>
);

export const DropdownMenuSeparator = () => (
  <div className="my-1 h-px bg-border" />
);

export const DropdownMenuItem = ({ children, onClick, asChild, className = "", setOpen }) => {
  const handleClick = (e) => {
    onClick && onClick(e);
    setOpen && setOpen(false);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      className: `flex items-center w-full px-3 py-2 text-sm cursor-pointer hover:bg-secondary rounded-lg ${className} ${children.props.className || ""}`,
    });
  }

  return (
    <div
      onClick={handleClick}
      className={`flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-secondary rounded-lg ${className}`}
    >
      {children}
    </div>
  );
};
