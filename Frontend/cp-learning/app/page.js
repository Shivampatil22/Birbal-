
import { ProfileForm } from '@/components/Forms/ProfileForm'
import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { userId, redirectToSignIn } = await auth()

  if (!userId) return redirectToSignIn()

  return <div className='w-full h-full flex flex-col  items-center'>
    <div className='w-full py-4 flex px-4 justify-end'><UserButton/></div>
    <main className='flex w-full h-full justify-center items-center'>
      <ProfileForm />
    </main>
 
  </div>
}