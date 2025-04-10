const Summary = ({ summary }) => {
  return (
    <div className="flex flex-col w-full h-max p-6 rounded-xl bg-[#1e1e1e] shadow-lg">
      <div className="text-xl text-white font-semibold">Summary</div>
      <div className="text-[1rem] font-normal text-gray-300 mt-3">
        {summary ? summary : "No summary available."}
      </div>
    </div>
  );
};

export default Summary;
