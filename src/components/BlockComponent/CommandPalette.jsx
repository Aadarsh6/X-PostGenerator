import { useEffect, useMemo, useRef, useState } from 'react'
import { CornerDownLeft, Search } from 'lucide-react'

export const CommandPalette = ({ open, onClose, commands = [] }) => {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const selectedRef = useRef(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      `${c.label} ${c.group} ${c.keywords || ''}`.toLowerCase().includes(q),
    )
  }, [commands, query])

  /* Reset state + lock scroll + autofocus when opened */
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelected(0)
      requestAnimationFrame(() => inputRef.current?.focus())
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  /* Keyboard navigation */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelected((s) => Math.min(s + 1, filtered.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelected((s) => Math.max(s - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const cmd = filtered[selected]
        if (cmd) {
          onClose()
          cmd.run()
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, filtered, selected, onClose])

  /* Keep the selected row in view */
  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: 'nearest' })
  }, [selected])

  if (!open) return null

  /* Group the filtered commands for display */
  const groups = []
  filtered.forEach((c) => {
    const existing = groups.find((g) => g.name === c.group)
    if (existing) existing.items.push(c)
    else groups.push({ name: c.group, items: [c] })
  })

  /* Highlight the matched portion of the label */
  const highlight = (text) => {
    const q = query.trim().toLowerCase()
    const i = q ? text.toLowerCase().indexOf(q) : -1
    if (i === -1) return text
    return (
      <>
        {text.slice(0, i)}
        <span className="text-white">{text.slice(i, i + q.length)}</span>
        {text.slice(i + q.length)}
      </>
    )
  }

  let flatIndex = -1

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]">
      {/* Backdrop */}
      <div
        className="animate-fade-in absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="animate-pop-in relative w-full max-w-[580px] overflow-hidden rounded-2xl border border-[#2c2c2c] bg-[#141414]/90 shadow-[0_32px_90px_-12px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-[#222323] px-4">
          <Search size={18} className="shrink-0 text-gray-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelected(0)
            }}
            placeholder="Search commands…"
            spellCheck="false"
            autoComplete="off"
            className="h-[52px] w-full bg-transparent text-[15px] text-white placeholder:text-gray-600 focus:outline-none"
          />
          <span className="kbd shrink-0">esc</span>
        </div>

        {/* List */}
        <div className="max-h-[340px] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
              <Search size={20} className="text-gray-700" />
              <p className="text-sm text-gray-500">
                No results for <span className="text-gray-300">“{query}”</span>
              </p>
            </div>
          )}

          {groups.map((group) => (
            <div key={group.name} className="mb-1">
              <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-600">
                {group.name}
              </p>
              {group.items.map((cmd) => {
                flatIndex += 1
                const Icon = cmd.icon
                const isSelected = flatIndex === selected
                return (
                  <button
                    key={cmd.id}
                    ref={isSelected ? selectedRef : null}
                    onMouseEnter={() => setSelected(flatIndex)}
                    onClick={() => {
                      onClose()
                      cmd.run()
                    }}
                    style={{ animationDelay: `${Math.min(flatIndex * 30, 180)}ms` }}
                    className={`animate-fade-up flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm outline-none transition-colors duration-100 ${
                      isSelected ? 'bg-[#ea580c]/10 text-white' : 'text-gray-400'
                    }`}
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.75}
                      className={isSelected ? 'shrink-0 text-[#ea580c]' : 'shrink-0 text-gray-500'}
                    />
                    <span className="flex-1 truncate">{highlight(cmd.label)}</span>
                    {cmd.shortcut && <span className="kbd shrink-0">{cmd.shortcut}</span>}
                    {isSelected && <CornerDownLeft size={14} className="shrink-0 text-gray-500" />}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 border-t border-[#222323] px-4 py-2.5 text-[11px] text-gray-600">
          <span className="flex items-center gap-1.5">
            <span className="kbd">↑</span>
            <span className="kbd">↓</span> navigate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="kbd">↵</span> select
          </span>
          <span className="ml-auto hidden font-medium tracking-wide sm:block">XCrafter</span>
        </div>
      </div>
    </div>
  )
}