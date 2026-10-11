import { Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { Logo, LogoMark } from './Brand'

const FEATURES = [
  'Craft single posts or full threads in your tone',
  'Every post checked against the 280-character limit',
  'Save your library and post straight to X',
]

/* ------------------------- input field (shared) -------------------------- */

export const AuthField = ({ id, label, icon: Icon, endAdornment, hint, ...inputProps }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-[13px] font-medium text-gray-300">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          strokeWidth={1.75}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600"
        />
      )}
      <input
        id={id}
        className={`h-11 w-full rounded-xl border border-[#242424] bg-[#111111] text-[15px] text-gray-200 outline-none transition-all duration-200 placeholder:text-gray-600 hover:border-[#333333] focus:border-[#ea580c]/60 focus:ring-2 focus:ring-[#ea580c]/25 ${
          Icon ? 'pl-10' : 'pl-3.5'
        } ${endAdornment ? 'pr-11' : 'pr-3.5'}`}
        {...inputProps}
      />
      {endAdornment}
    </div>
    {hint && <p className="text-[11px] text-gray-600">{hint}</p>}
  </div>
)

/* --------------------------- brand panel (left) --------------------------- */

const BrandPanel = () => (
  <aside className="relative hidden flex-col overflow-hidden border-r border-[#1c1c1c] lg:flex lg:w-[420px] xl:w-[480px]">
    {/* Ambient layers */}
    <div
      aria-hidden="true"
      className="dot-grid pointer-events-none absolute inset-0"
      style={{
        WebkitMaskImage: 'radial-gradient(ellipse 90% 60% at 30% 20%, black, transparent 75%)',
        maskImage: 'radial-gradient(ellipse 90% 60% at 30% 20%, black, transparent 75%)',
      }}
    />
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
      <div className="glow-blob h-[360px] w-[620px] rounded-full opacity-40 blur-3xl" />
    </div>

    {/* Watermark mark */}
    <LogoMark
      size="lg"
      className="pointer-events-none absolute -bottom-14 -right-14 scale-[7] opacity-[0.05]"
    />

    <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-14">
      <Logo size="md" to="/" ariaLabel="XCrafter home" />

      <div>
        <h2 className="text-[34px] font-semibold leading-[1.1] tracking-[-0.03em] text-white xl:text-[42px]">
          Stop guessing.
          <br />
          Start <span className="font-serif-accent text-[1.08em] text-[#f97316]">trending</span>.
        </h2>

        <ul className="mt-9 space-y-4">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-gray-400">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-[#ea580c]/25 bg-[#ea580c]/10">
                <Check size={11} strokeWidth={3} className="text-[#f97316]" />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-gray-700">
        © {new Date().getFullYear()} XCrafter. All rights reserved.
      </p>
    </div>
  </aside>
)

/* ------------------------------- layout shell ------------------------------ */

export const AuthLayout = ({ children }) => (
  <div className="relative flex min-h-screen bg-[#0a0a0a] antialiased">
    <BrandPanel />

    {/* Film grain (fixed, covers everything) */}
    <div aria-hidden="true" className="noise" />

    {/* Form side */}
    <div className="relative flex min-w-0 flex-1 flex-col">
      <div
        aria-hidden="true"
        className="dot-grid pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 40%, black, transparent 75%)',
          maskImage: 'radial-gradient(ellipse 70% 50% at 50% 40%, black, transparent 75%)',
        }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
        <div className="glow-blob h-[300px] w-[520px] rounded-full opacity-30 blur-3xl" />
      </div>

      {/* Back to home */}
      <div className="relative z-10 flex items-center px-5 pt-6 sm:px-8">
        <Link
          to="/"
          className="group -ml-2 flex items-center gap-2 rounded-lg p-2 text-sm font-medium text-gray-500 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#ea580c]/60"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span className="hidden sm:inline">Back to home</span>
          <span className="sm:hidden">Home</span>
        </Link>
      </div>

      {/* Centered form column */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[400px]">
          <div className="mb-10 flex justify-center lg:hidden">
            <Logo size="md" to="/" ariaLabel="XCrafter home" />
          </div>
          {children}
        </div>
      </div>
    </div>
  </div>
)