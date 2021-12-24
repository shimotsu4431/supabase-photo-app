import React from 'react'
import { useUser } from '../../../hooks/useUser'

export const Header: React.FC = () => {
  const {
    profile,
  } = useUser()

  return (
    <header className="p-8 font-bold text-white bg-main flex justify-between items-center">
      <h1 className="text-xl lg:text-2xl">Photo App</h1>
      {/* {profile && profile.nickname && (
        <div>
        Hi! {profile?.nickname}
      </div>
      )} */}
    </header>
  )
}
