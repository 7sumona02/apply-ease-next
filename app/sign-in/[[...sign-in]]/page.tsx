import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='h-[85vh] flex-center'>
      <SignIn 
        redirectUrl="/dashboard"
      />
    </div>
  )
}