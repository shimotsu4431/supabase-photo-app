import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
import { PublicPhoto } from '../../../types/publicPhoto'
import { Profile, useUser } from '../../../hooks/useUser'
import { supabase } from '../../../utils/supabaseClient'
import { toast } from 'react-toastify'
import Router from 'next/router'

type props = {
  user: Profile
  photoData: PublicPhoto
}

export const CommentList: React.FC<props> = ({ user, photoData }) => {
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
    <ul className=''>
      {photoData && photoData.comments && photoData.comments.length > 0 ? photoData.comments.map((c) => {
        return (
          <li key={c.id} className='border-2 p-4 mb-4'>
            {c.users.avatarurl && (
              <div className=''>
                <Link href={`/${c.users.fullname}`}>
                  <a>
                    <Image className='rounded-full' src={c.users.avatarurl} width={30} height={30} alt={c.users.nickname ?? ""}></Image>
                  </a>
                </Link>
              </div>
            )}
            <p className='font-bold'>{c.users.nickname}</p>
            <p className='text-base'>{c.body}</p>
            {profile?.id === c.userId && (
              <div className='mt-4'>
                <button className='mr-2 underline'>編集</button>
                <button onClick={() => handleDelete(c.id)} className='underline'>削除</button>
              </div>
            )}
          </li>
        )
      }) : (
        <div>
          <p>コメントはありません</p>
        </div>
      )}
    </ul>
  )
}
