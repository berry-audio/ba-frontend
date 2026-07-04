const Drawer = ({ children, open, onClick }: { children: React.ReactNode; open: boolean; onClick: () => void }) => {
  return (
    <>
      {open && <div className="fixed inset-0 bg-background/0 z-1 transition-opacity duration-200" onClick={onClick} />}
      <div
        className={`fixed top-0 right-0 h-full w-full lg:w-200 dark:bg-neutral-800 bg-neutral-100 shadow-2xl  z-40 lg:px-4 py-5 overflow-y-auto overflow-x-visible transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {children}
      </div>
    </>
  );
};
export default Drawer;