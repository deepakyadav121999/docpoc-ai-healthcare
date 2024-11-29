import React from 'react'
import SignUp from '@/components/Auth/Signup'
const page = ({ setAuthPage }: { setAuthPage: any }) => {
  return (
    <div>
      <SignUp setAuthPage={setAuthPage}/>
     </div>
  )
}

export default page