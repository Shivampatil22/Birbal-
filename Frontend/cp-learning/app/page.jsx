
import Nav from '@/components/Common/Nav';
import { ProfileForm } from '@/components/Forms/ProfileForm'

import { auth } from '@clerk/nextjs/server'
import axios from 'axios';
import { redirect} from 'next/navigation';





export default async function Page() {
  const { userId, redirectToSignIn } = await auth()

  
  if (!userId) return redirectToSignIn()
    console.log(userId);
  
  let url=`NEXT_FRONTEND_URL/api/user/id/${userId}/check`;
const result = await axios.get(url);
 
   
  //  const user=result.data;
  //  const {username,current_rating,tags,imageUrl}=user;
  //  const userInfo={
  //   username,
  //   current_rating,
  //   tags,
  //   imageUrl
  //  }
  //  console.log(userInfo);
  if(result.status==201){
    
     return redirect(`/profile/you`);
  }
  
  return <div className='w-full h-full   flex flex-col  items-center'>
  

      <ProfileForm />

 
  </div>
}