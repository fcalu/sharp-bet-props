type Props = {
  title: string
  description?: string
  emphasis?: "primary" | "secondary"
  children: React.ReactNode
}

export default function DecisionSection({
  title,
  description,
  emphasis = "secondary",
  children,
}: Props) {
  return (
    <section
      className={`space-y-4 ${
        emphasis === "primary" ? "bg-slate-50 p-4 rounded-xl" : ""
      }`}
    >
      <div>
        <h2
          className={`font-semibold ${
            emphasis === "primary"
              ? "text-xl text-slate-900"
              : "text-lg text-slate-700"
          }`}
        >
          {title}
        </h2>

        {description && (
          <p className="text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      <div className="space-y-4">{children}</div>
    </section>
  )
}
