import React from "react";

export const Avatar = ({ children, className = "" }) => (
  <div className={`relative flex shrink-0 overflow-hidden rounded-full ${className}`}>
    {children}
  </div>
);

export const AvatarImage = ({ src, alt }) => (
  <img className="aspect-square h-full w-full object-cover" src={src} alt={alt} />
);

export const AvatarFallback = ({ children }) => (
  <div className="flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium">
    {children}
  </div>
);
