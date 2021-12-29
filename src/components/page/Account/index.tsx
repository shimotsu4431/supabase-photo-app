import Link from 'next/link'
import React from 'react'
import { useUser } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'

export const Account: React.FC = () => {
  const {
    session,
    profile,
    signOut,
  } = useUser()

  return (
    <Main>
      <h2 className="text-xl mb-4">アカウント情報</h2>
      {session && profile && (
        <>
          <p>userId: {session.user?.id}</p>
          <p>email: {session.user?.email}</p>
          <p>name: {session.user?.user_metadata.name}</p>
          <p>nickName: {profile?.nickname ?? ""}</p>
          <p className='mt-2'>
            <Link href="/account/edit">
              <a className='border-gray-300 border-2 rounded p-1 mb-4'>編集</a>
            </Link>
          </p>
          <div className='mt-4'>
            <button onClick={signOut} className='border-gray-300 border-2 rounded p-1 mb-4'>ログアウト</button>
          </div>
        </>
      )}
    </Main>
  )
}
