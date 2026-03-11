export default function Backdrop({ open, onClick }) {
  if (!open) return null

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Close"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick?.()
      }}
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-[2px]"
    />
  )
}
