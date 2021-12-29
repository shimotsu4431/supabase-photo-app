import Link from 'next/link'
import React from 'react'
import { useUser } from '../../../hooks/useUser'

export const Menu: React.FC = () => {
  const {
    session,
    profile,
  } = useUser()

  return (
    <ul className='px-8 py-4 border-b-2'>
      <li>
        <Link href="/"><a className='underline'>Home</a></Link>
      </li>
      {session && (
        <>
          <li>
            <Link href={`/dashboard`}><a className='underline'>Dashboard</a></Link>
          </li>
          <li>
            <Link href={`/dashboard/likes`}><a className='underline'>Dashboard- Likes</a></Link>
          </li>
          <li>
            <Link href={`/user/${profile?.id}`}><a className='underline'>@{profile?.id}</a></Link>
          </li>
          <li>
            <Link href={`/user/${profile?.id}/photo/new`}><a className='underline'>photo - new</a></Link>
          </li>
          <li>
            <Link href="/account"><a className='underline'>Account</a></Link>
          </li>
          <li>
            <Link href="/account/edit"><a className='underline'>Account Edit</a></Link>
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
