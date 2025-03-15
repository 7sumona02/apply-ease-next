import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='h-[85vh] flex-center'>
      <SignUp />
    </div>
  )
}