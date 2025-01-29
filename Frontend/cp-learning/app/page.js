
import { ProfileForm } from '@/components/Forms/ProfileForm'
import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { userId, redirectToSignIn } = await auth()

  // if (!userId) return redirectToSignIn()

  return <div className='w-full h-full flex  justify-center items-center'>
    {/* <div><UserButton/></div> */}
    <main>
      <ProfileForm />
    </main>
 
  </div>
}