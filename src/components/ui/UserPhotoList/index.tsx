import React from 'react'
import { Profile, useUser } from '../../../hooks/useUser'
import { PublicPhoto } from '../../../types/publicPhoto'
import { UserPhotoItem } from '../UserPhotoItem'

type props = {
  user: Profile
  publicPhotos: PublicPhoto[]
}

export const UserPhotoList: React.FC<props> = ({ user, publicPhotos }) => {
  const { user: sessionUser } = useUser()
  return (
    <ul>
      {publicPhotos.map((p) => {
        if (sessionUser?.id !== user.id && !p.isPublished) return null

        return (
          <UserPhotoItem key={p.id} user={user} publicPhoto={p} />
        )
      })}
    </ul>
  )
}
