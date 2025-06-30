
// Fixed NavBar component
export const NavBar = () => {
  return (
    <nav className='fixed top-0 left-0 right-0 bg-gray-950/80 backdrop-blur-lg  shadow-lg z-50'>
      <div className='mx-auto flex h-16 max-w-7xl py-4 items-center justify-between px-4 sm:px-6 lg:px-8'>
        <div className='text-2xl font-bold text-orange-600'>
          Xc Craft
        </div>
        <div className='space-x-2 md:space-x-4'>
          <button className='rounded px-4 py-2 font-medium text-blue-600 transition hover:bg-blue-50'>
            Login
          </button>
          <button className='rounded bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700'>
            Sign Up Free
          </button>
        </div>
      </div>
    </nav>
  );
};