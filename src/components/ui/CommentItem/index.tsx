import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { PublicPhoto } from '../../../types/publicPhoto'
import { Profile, useUser } from '../../../hooks/useUser'
import { supabase } from '../../../utils/supabaseClient'
import { toast } from 'react-toastify'
import Router from 'next/router'
import { Comment } from '../../../types/comment'
import { SUPABASE_BUCKET_COMMENTS_PATH } from '../../../utils/const'
import nl2br from "react-nl2br"

type props = {
  user: Profile
  comment: Comment
  photoData: PublicPhoto
}

export const CommentItem: React.FC<props> = ({ user, comment, photoData }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editComment, setComment] = useState<string>('')

  const {
    profile
  } = useUser()

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profile) {
      toast.info('ログインしてください。')

      return
    }

    try {
      await supabase.from(SUPABASE_BUCKET_COMMENTS_PATH)
      .update({ body: editComment })
      .match({ id: comment.id })
      .single();

      toast.success("コメントを更新しました！")
      Router.push({
        pathname: `/${user.fullname}/photo/${photoData.id}`,
      }, undefined, { scroll: false })
    } catch (err) {
      toast.error("エラーが発生しました。")
    } finally {
      setComment('')
      setIsEditing(false)
    }
  }

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
    <li key={comment.id} className='border-2 p-4 mb-4 w-96'>
      <div className='flex items-center'>
        {comment.users.avatarurl && (
          <div>
            <Link href={`/${comment.users.fullname}`}>
              <a>
                <Image className='rounded-full' src={comment.users.avatarurl} width={30} height={30} alt={comment.users.nickname ?? ""}></Image>
              </a>
            </Link>
          </div>
        )}
        <p className='font-bold ml-2'>{comment.users.nickname}</p>
      </div>
      {!isEditing && <p className='text-base'>{nl2br(comment.body)}</p>}
      {isEditing && (
        <div>
          <form onSubmit={handleUpdate} className='flex flex-col'>
            <textarea
              required
              value={editComment ?? ''}
              onChange={(e) => setComment(e.target.value)}
              placeholder=""
              className='border-gray-300 border-2 rounded p-1 mr-2'
            />
            <div>
              <button type="submit" className='border-gray-300 border-2 rounded p-1 w-12 mt-2 mr-2'>更新</button>
              <button onClick={() => setIsEditing(false)} className='border-gray-300 border-2 rounded p-1 w-16 mt-2'>閉じる</button>
            </div>
          </form>
        </div>
      )}
      {profile?.id === comment.userId && !isEditing &&(
        <div className='flex justify-end'>
          <button onClick={() => {
              setIsEditing(!isEditing)
              setComment(comment.body)
            }
          } className='mr-2 underline'>編集</button>
          <button onClick={() => handleDelete(comment.id)} className='underline'>削除</button>
        </div>
      )}
    </li>
  )
}
