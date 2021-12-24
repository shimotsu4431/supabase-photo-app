import React from 'react'
import { useUser } from '../../../hooks/useUser'

export const Header: React.FC = () => {
  const {
    session,
    profile,
  } = useUser()

  return (
    <header className="p-8 font-bold text-white bg-main flex justify-between items-center">
      <h1 className="text-xl lg:text-2xl">Photo App</h1>
      <div>
        Hi! {profile?.nickname ? profile.nickname : session?.user?.user_metadata.name}
      </div>
    </header>
  )
}
