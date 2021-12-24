import type { NextPage } from 'next'
import Router from 'next/router'
import { useEffect } from 'react'
import { useUser } from '../hooks/useUser'

const Login: NextPage = () => {
  const {
    session,
    signInWithGoogle,
    signOut
  } = useUser()

  console.log("session", session)

  useEffect(() => {
    if (session) Router.push('/')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div className='p-8'>
      <h1 className='mb-4'>Login</h1>
      <div>
        {session ? (
          <button onClick={signOut} className='border-gray-300'>ログアウト</button>
        ) : (
          <button onClick={signInWithGoogle} className='border-gray-300 border-2 rounded p-1'>Googleでログイン</button>
        )}
      </div>
    </div>
  )
}

export default Login
