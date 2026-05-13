type Props = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({
  open,
  onClose,
  children
}: Props) {

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* MODAL */}
      <div className="relative z-10 bg-[#0f172a] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-fadeIn">

        {children}

      </div>

    </div>
  );
}