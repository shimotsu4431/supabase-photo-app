import React from 'react'
import { useUser } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'

export const Login: React.FC = () => {
  const {
    session,
    signOut,
    signInWithGoogle
  } = useUser()

  return (
    <Main>
      <h2 className="text-xl mb-4">Login</h2>
      <div>
          {session ? (
            <button onClick={signOut} className='border-gray-300'>ログアウト</button>
          ) : (
            <button onClick={signInWithGoogle} className='border-gray-300 border-2 rounded p-1'>Googleでログイン</button>
          )}
      </div>
    </Main>
  )
}
