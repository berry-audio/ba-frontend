const Drawer = ({ children, open, onClick }: { children: React.ReactNode; open: boolean; onClick: () => void }) => {
  return (
    <>
      {open && <div className="fixed inset-0 z-80 flex items-center justify-center  bg-overlay transition-opacity duration-300" onClick={onClick} />}
      <div
        className={`fixed lg:rounded-tl-2xl lg:rounded-bl-2xl top-0 right-0 h-full w-full lg:w-150 bg-secondary shadow-2xl  z-90 lg:px-3 py-5 overflow-y-auto overflow-x-visible transition-opacity duration-200 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none "
        }`}
      >
        {children}
      </div>
    </>
  );
};
export default Drawer;
