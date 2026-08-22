import React, { useState, createContext, useContext } from "react";

const TabsContext = createContext({ active: "", setActive: () => {} });

export const Tabs = ({ defaultValue, children, className = "" }) => {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = "" }) => (
  <div className={`flex gap-1 ${className}`}>{children}</div>
);

export const TabsTrigger = ({ value, children, className = "" }) => {
  const { active, setActive } = useContext(TabsContext);
  return (
    <button
      onClick={() => setActive(value)}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${className} ${
        active === value
          ? "bg-white shadow-sm text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className = "" }) => {
  const { active } = useContext(TabsContext);
  if (active !== value) return null;
  return <div className={className}>{children}</div>;
};
