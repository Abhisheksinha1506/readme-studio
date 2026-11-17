import ReactMarkdownStyled from "./ReactMarkdownStyled"

const Preview = ({ output }: { output: string }) => {
  return (
    <div className="gap-6 p-6 xl:size-full">
      {/* The proof: always paper-colored, contrasting against the ink chrome
          around it even in dark mode. */}
      <div className="relative flex-col rounded-sm border border-ink/15 bg-paper bg-grain bg-repeat p-6 text-ink shadow-[4px_4px_0_0_hsl(var(--ink)/0.5)] xl:size-full">
        <span
          className="register-mark absolute right-4 top-4 text-ink/30"
          aria-hidden
        />
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40">
          Proof
        </p>
        <ReactMarkdownStyled output={output} />
      </div>
    </div>
  )
}

export default Preview
