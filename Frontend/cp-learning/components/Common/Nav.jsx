import { UserButton } from "@clerk/nextjs";


const Nav = ({profile_id}) => {
  return (
    <div className="w-full  py-6  flex px-6 items-center justify-between">
      <div className="flex text-xl font-semibold "> Welcome {profile_id}</div>
      <UserButton />
    </div>
  );
}

export default Nav
