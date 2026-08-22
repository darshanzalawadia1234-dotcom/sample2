import React from "react";

export const Sheet = ({ open, onOpenChange, children }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80"
      onClick={() => onOpenChange(false)}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-white p-6 h-full overflow-y-auto shadow-xl"
      >
        {children}
      </div>
    </div>
  );
};

export const SheetContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);

export const SheetHeader = ({ children, className = "" }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

export const SheetTitle = ({ children, className = "" }) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
);

export const SheetTrigger = ({ children }) => <>{children}</>;
