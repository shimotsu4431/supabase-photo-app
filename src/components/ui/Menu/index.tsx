import Link from 'next/link'
import React from 'react'
import { useUser } from '../../../hooks/useUser'

export const Menu: React.FC = () => {
  const {
    session,
    profile,
  } = useUser()

  return (
    <ul className='px-8 py-4'>
      <li>
        <Link href="/"><a className='underline'>Home</a></Link>
      </li>
      {session && (
        <>
          <li>
            <Link href={`/${profile?.fullname}`}><a className='underline'>@{profile?.fullname}</a></Link>
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
