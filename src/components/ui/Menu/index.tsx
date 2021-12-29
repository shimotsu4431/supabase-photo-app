import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useUser } from '../../../hooks/useUser'

export const Menu: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const {
    session,
    profile,
  } = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) return null

  return (
    <ul className='px-8 py-4 border-b-2'>
      {session && (
        <>
          <li>
            <Link href={`/user/${profile?.id}`}><a className='underline'>mypage</a></Link>
          </li>
          <li>
            <Link href={`/dashboard`}><a className='underline'>Dashboard</a></Link>
          </li>
          <li>
            <Link href={`/dashboard/likes`}><a className='underline'>Dashboard- Likes</a></Link>
          </li>
          <li>
            <Link href={`/user/${profile?.id}/photo/new`}><a className='underline'>photo - new</a></Link>
          </li>
          <li>
            <Link href="/account"><a className='underline'>Account</a></Link>
          </li>
        </>
      )}
      {!session && (
        <>
          <li>
            <Link href={`/login`}><a className='underline'>login</a></Link>
          </li>
        </>
      )}
    </ul>
  )
}
