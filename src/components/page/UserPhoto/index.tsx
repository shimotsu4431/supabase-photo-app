import React, { useState } from 'react'
import Image from 'next/image'

import { Profile, useUser } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'
import { PublicPhoto } from '../../../types/publicPhoto'
import { supabase } from '../../../utils/supabaseClient'
import { toast } from 'react-toastify'
import Router from 'next/router'
import { CommentList } from '../../ui/CommentList'

type props = {
  user: Profile
  photoData: PublicPhoto
}

export const UserPhoto: React.FC<props> = ({ user, photoData }) => {
  const [comment, setComment] = useState<string>('')

  const {
    profile
  } = useUser()

  const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profile) {
      toast.info('ログインしてください。')

      return
    }

    try {
      // DBにレコード作成
      await supabase.from('comments').insert([{
        userId: profile.id,
        photoId: photoData.id,
        body: comment,
      }])

      toast.success("コメントを投稿しました！")
      Router.push({
        pathname: `/${user.fullname}/photo/${photoData.id}`,
      }, undefined, { scroll: false })
    } catch (err) {
      toast.error("エラーが発生しました。")
    } finally {
      setComment('')
    }
  }

  return (
    <Main>
      <h2 className="text-xl mb-2">{photoData.title}</h2>
      <div>
        <Image className='w-4/12' src={photoData.src} alt="image" width={300} height={200} layout='fixed' objectFit={"contain"} />
      </div>
      <div className='mt-4 pt-4 border-t-2'>
        <h3 id="comments" className='text-xl mb-4 font-bold'>コメント一覧</h3>
        <CommentList user={user} photoData={photoData} />
        <div className='mt-6'>
          <h2 className='text-base font-bold mb-2'>コメントを投稿する</h2>
          <div>
            <form onSubmit={handleSend} className='flex flex-col'>
              <textarea
                required
                value={comment ?? ''}
                onChange={(e) => setComment(e.target.value)}
                placeholder=""
                className='border-gray-300 border-2 rounded p-1 mr-2 mb-2 w-96'
              />
              <button type="submit" className='border-gray-300 border-2 rounded p-1 w-12'>投稿</button>
            </form>
          </div>
        </div>
      </div>
    </Main>
  )
}
