import { UserButton } from "@clerk/nextjs";



const links=[
  {
    name:'Problems',
    href:'/problems'
  },
  {
    name:'Contests',
    href:'/contests'
  },
  {
    name:'Profile',
    href:'/profile'
  }
]

const Nav = ({profile_id}) => {
  return (
    <nav className="w-full h-15  py-3  flex px-6 items-center justify-between">
      <div className="flex text-xl font-semibold "> Welcome {profile_id}</div>
      <UserButton />
    </nav>
  );
}

export default Nav
