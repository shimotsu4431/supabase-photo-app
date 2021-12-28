import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"

import { Profile, useUser } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'
import { PublicPhoto } from '../../../types/publicPhoto'
import { supabase } from '../../../utils/supabaseClient'
import { toast } from 'react-toastify'
import Router from 'next/router'
import { CommentList } from '../../ui/CommentList'
import { DateTime } from 'luxon'
import Link from 'next/link'
import { Like } from '../../../types/likes'

type props = {
  user: Profile
  photoData: PublicPhoto
}

export const UserPhoto: React.FC<props> = ({ user, photoData }) => {
  const [comment, setComment] = useState<string>('')
  const [like, setLike] = useState<Like | null>(null)
  const [likeCount, setLikeCount] = useState<number>(0)

  const {
    profile
  } = useUser()

  useEffect(() => {
    setLikeCount(photoData.likes && photoData.likes.length ? photoData.likes.length : 0)

    if (photoData && photoData.likes && photoData.likes.some((like) => like.userId === profile?.id)) {
      setLike(photoData.likes.filter((like) => like.userId === profile?.id)[0])

      return
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[profile])

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

  const handleLike = useCallback(async () => {
    if (!profile) {
      toast.info('ログインしてください。')

      return
    }

    try {
      if (like) {
        await supabase.from('likes').delete().eq('id', like.id)
        setLike(null)
        setLikeCount(likeCount - 1)
      } else {
        const { data } = await supabase.from('likes').insert([{
          userId: profile.id,
          photoId: photoData.id,
        }])
        setLike(data && data[0])
        setLikeCount(likeCount + 1)
      }
    } catch(error) {
      console.log(error)
      toast.error("エラーが発生しました。")
    }
  },[like, likeCount, photoData.id, profile])

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
      <div className='w-96 flex py-2'>
        <button className='mr-2' onClick={() => handleLike()}>
          {like ? <AiFillHeart size={24} /> : <AiOutlineHeart size={24} />}
        </button>
        <span>{likeCount}</span>
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
