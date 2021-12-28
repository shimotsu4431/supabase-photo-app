import React, { useState } from 'react'
import Image from 'next/image'

import { Profile, useUser } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'
import { PublicPhoto } from '../../../types/publicPhoto'
import { supabase } from '../../../utils/supabaseClient'
import { toast } from 'react-toastify'
import Router from 'next/router'
import { CommentList } from '../../ui/CommentList'
import { DateTime } from 'luxon'
import Link from 'next/link'

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
      <div className='flex items-center mb-4'>
        {user.avatarurl && (
          <div className='flex items-center mr-2'>
            <Link href={`/${user.fullname}`}>
              <a className=''>
                <Image className='rounded-full' src={user.avatarurl} width={30} height={30} alt={user.nickname ?? ""}></Image>
              </a>
            </Link>
          </div>
        )}
        <p>{user.nickname}</p>
      </div>
      <p className='text-sm mb-2'>投稿日: {DateTime.fromISO(photoData.updated_at ?? photoData.created_at).toFormat('yyyy.MM.dd')}</p>
      <h2 className="text-2xl mb-2">{photoData.title}</h2>
      <div>
        <Image src={photoData.src} alt="image" width={300} height={200} />
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
