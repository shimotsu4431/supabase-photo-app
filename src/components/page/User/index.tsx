import React from 'react'
import Image from 'next/image'
import { Profile } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'
import { PublicPhoto } from '../../../types/publicPhoto'
import { UserPhotoList } from '../../ui/UserPhotoList'

type props = {
  user: Profile
  publicPhotos: PublicPhoto[]
}

export const UserDetail: React.FC<props> = ({ user, publicPhotos }) => {
  return (
    <Main>
      <h2 className="text-xl mb-4">{user.nickname} さんの画像一覧</h2>
      <Image
          src={user.avatarurl ?? ""}
          width={48}
          height={48}
          alt={user.fullname ?? ""}
      />
      <div className='py-2'>
        <UserPhotoList user={user} publicPhotos={publicPhotos} />
      </div>
    </Main>
  )
}
