import type { NextPage } from 'next'
import Link from 'next/link'
import { useUser } from '../hooks/useUser'

const Home: NextPage = () => {
  const {
    session
  } = useUser()

  console.log("session", session)

  return (
    <div className='p-8'>
      <h1 className='mb-4'>Home</h1>
      {session ? (
        <>
          <p>userId: {session.user?.id}</p>
          <p>email: {session.user?.email}</p>
        </>
      ) : (
        <p><Link href={'/login'}><a>ログイン</a></Link></p>
      )}
    </div>
  )
}

export default Home
