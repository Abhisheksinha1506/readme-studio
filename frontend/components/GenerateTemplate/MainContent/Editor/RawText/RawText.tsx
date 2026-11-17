// TODO: Stylize & implement properly

const RawText = ({ output }: { output: string }) => {
  return (
    <div className="gap-6 p-6 xl:size-full">
      <div className="flex-col rounded-lg border border-dashed p-6 shadow-sm xl:size-full">
        <pre className="whitespace-pre-wrap break-words">{output}</pre>
      </div>
    </div>
  )
}

export default RawText
