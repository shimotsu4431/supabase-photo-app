import Link from 'next/link'
import React from 'react'
import { useUser } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'

export const Account: React.FC = () => {
  const {
    session,
    profile,
  } = useUser()

  return (
    <Main>
      <h2 className="text-xl mb-4">Account</h2>
      {session && (
        <>
          <p>userId: {session.user?.id}</p>
          <p>email: {session.user?.email}</p>
          <p>name: {session.user?.user_metadata.name}</p>
          <p>nickName: {profile?.nickname ?? "[未設定]"}</p>
          <Link href="/account/edit">
            <a className='underline'>編集</a>
          </Link>
        </>
      )}
    </Main>
  )
}
