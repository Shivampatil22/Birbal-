

const page =async ({params}) => {
    const {contestId, index} =await  params;
  return (
    <div>
      {contestId} {index}
    </div>
  )
}

export default page
