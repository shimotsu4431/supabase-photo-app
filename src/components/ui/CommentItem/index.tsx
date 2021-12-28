import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { PublicPhoto } from '../../../types/publicPhoto'
import { Profile, useUser } from '../../../hooks/useUser'
import { supabase } from '../../../utils/supabaseClient'
import { toast } from 'react-toastify'
import Router from 'next/router'
import { Comment } from '../../../types/comment'

type props = {
  user: Profile
  comment: Comment
  photoData: PublicPhoto
}

export const CommentItem: React.FC<props> = ({ user, comment, photoData }) => {
  const {
    profile
  } = useUser()

  const handleDelete = async (commentId: number) => {
    if (!window.confirm("コメント削除しますか？")) return

    try {
      await supabase.from('comments').delete().eq('id', commentId)
      toast.success('コメントを削除しました')
      Router.push({
        pathname: `/${user.fullname}/photo/${photoData.id}`,
      }, undefined, { scroll: false })
    } catch (error) {
      console.log(error)
      toast.error('削除に失敗しました。')
    }
  }

  return (
    <li key={comment.id} className='border-2 p-4 mb-4'>
      {comment.users.avatarurl && (
        <div className=''>
          <Link href={`/${comment.users.fullname}`}>
            <a>
              <Image className='rounded-full' src={comment.users.avatarurl} width={30} height={30} alt={comment.users.nickname ?? ""}></Image>
            </a>
          </Link>
        </div>
      )}
      <p className='font-bold'>{comment.users.nickname}</p>
      <p className='text-base'>{comment.body}</p>
      {profile?.id === comment.userId && (
        <div className='mt-4'>
          <button className='mr-2 underline'>編集</button>
          <button onClick={() => handleDelete(comment.id)} className='underline'>削除</button>
        </div>
      )}
    </li>
  )
}
