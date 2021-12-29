import React from 'react'
import { PublicPhoto } from '../../../types/publicPhoto'
import { Profile, useUser } from '../../../hooks/useUser'
import { CommentItem } from '../CommentItem'

type props = {
  user: Profile | undefined
  photoData: PublicPhoto
}

export const CommentList: React.FC<props> = ({ user, photoData }) => {
  return (
    <ul className=''>
      {photoData && photoData.comments && photoData.comments.length > 0 ? photoData.comments.map((c) => {
        return (
          <CommentItem key={c.id} user={user} comment={c} photoData={photoData} />
        )
      }) : (
        <div>
          <p>コメントはありません</p>
        </div>
      )}
    </ul>
  )
}
