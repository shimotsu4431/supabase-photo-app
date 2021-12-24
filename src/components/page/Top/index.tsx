import Link from 'next/link'
import React from 'react'
import { useUser } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'

export const Top: React.FC = () => {
  const {
    session,
    signOut
  } = useUser()

  return (
    <Main>
      <h2 className="text-xl mb-4">Home</h2>
      {session ? (
          <>
            <p>userId: {session.user?.id}</p>
            <p>email: {session.user?.email}</p>
            <button onClick={signOut} className='border-gray-300 border-2 rounded p-1 mt-4'>ログアウト</button>
          </>
        ) : (
          <p><Link href={'/login'}><a>ログイン</a></Link></p>
      )}
    </Main>
  )
}
