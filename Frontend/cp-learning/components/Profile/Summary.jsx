

const Summary = ({summary}) => {
  return (
    <div className="flex flex-col w-full h-[10.5rem] p-3 rounded-xl bg-slate-200">
        <div className="text-xl text-gray-700 font-semibold">Summary</div>
        <div className="text-[1rem] font-normal">{summary}</div>
    </div>
  )
}

export default Summary
