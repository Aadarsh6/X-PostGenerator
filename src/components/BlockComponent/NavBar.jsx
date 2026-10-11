<nav className="hidden items-center gap-1 md:flex">
  {[{ label: 'How it works', id: 'how-it-works' }, { label: 'Results', id: 'results' }, { label: 'Demo', id: 'demo' }].map((item) => (
    <a key={item.id} href={`#${item.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' }) }}
      className="rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white">
      {item.label}
    </a>
  ))}
</nav>