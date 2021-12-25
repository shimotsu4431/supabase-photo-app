import React from 'react'
import Image from 'next/image'
import { Profile } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'

type props = {
  user: Profile
}

export const UserDetail: React.FC<props> = ({ user }) => {
  return (
    <Main>
      <h2 className="text-xl mb-4">{user.nickname} さんのページ</h2>
      <Image
          src={user.avatarurl ?? ""}
          width={48}
          height={48}
          alt={user.fullname ?? ""}
        />
    </Main>
  )
}
