import React, { useState } from 'react'
import Image from 'next/image'

import { Profile, useUser } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'
import { PublicPhoto } from '../../../types/publicPhoto'
import Link from 'next/link'
import { supabase } from '../../../utils/supabaseClient'
import { toast } from 'react-toastify'
import Router from 'next/router'

type props = {
  user: Profile
  photoData: PublicPhoto
}

export const UserPhoto: React.FC<props> = ({ user, photoData }) => {
  const [comment, setComment] = useState<string>('')
  const {
    profile
  } = useUser()
  console.log("photoData", photoData)
  console.log("photoData.comments", photoData.comments)

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
        <h3 className='text-xl mb-4 font-bold'>コメント一覧</h3>
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
                    <button className='underline'>削除</button>
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
        <div className='mt-6'>
          <h2 className='text-base font-bold mb-2'>コメントを投稿する</h2>
          <div>
            <form onSubmit={handleSend} className='flex flex-col'>
              <textarea
                required
                value={comment ?? ''}
                onChange={(e) => setComment(e.target.value)}
                placeholder=""
                className='border-gray-300 border-2 rounded p-1 mr-2 w-96'
              />
              <button type="submit" className='border-gray-300 border-2 rounded p-1 w-12 mt-2'>投稿</button>
            </form>
          </div>
        </div>
      </div>
    </Main>
  )
}
