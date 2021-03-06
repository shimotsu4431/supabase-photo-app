import React, { useEffect } from 'react'
import { DateTime } from 'luxon'
import Image from 'next/image'

import { SubmitHandler, useForm } from 'react-hook-form'
import { supabase } from '../../../utils/supabaseClient'
import { Main } from '../../ui/Main'
import Router from 'next/router';
import { toast } from 'react-toastify';
import { PublicPhoto } from '../../../types/publicPhoto';
import { SUPABASE_BUCKET_COMMENTS_PATH, SUPABASE_BUCKET_LIKES_PATH, SUPABASE_BUCKET_PHOTOS_PATH } from '../../../utils/const'

type props = {
  photoData: PublicPhoto
}

type Inputs = {
  title: string,
  is_published: boolean
};

export const UserPhotoEdit: React.FC<props> = ({ photoData }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>();

  useEffect(() => {
    setValue("title", photoData.title)
    setValue("is_published", photoData.is_published)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const onSubmit: SubmitHandler<Inputs> = async (data, event): Promise<void> => {
    const { title, is_published } = data

    try {
      // レコード更新
      await supabase
        .from(SUPABASE_BUCKET_PHOTOS_PATH)
        .update({
          title: title,
          is_published: is_published,
          updated_at: DateTime.now()
        })
        .match({ id: photoData.id })

      toast.success("画像を更新しました！")
      Router.push(`/user/${photoData?.user?.id}`)
    } catch(error) {
      console.log(error)
      toast.error("エラーが発生しました。")
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("削除しますか？")) return

    try {
      // まず likes を取得
      const { data: likes } = await supabase
      .from(SUPABASE_BUCKET_LIKES_PATH)
      .select(`*`)
        .eq("photoId", id)

      // likes を全削除
      // FIXME: いい感じにバックエンド側で削除できないか？
      if (likes) {
        for (const like of likes) {
          await supabase.from(SUPABASE_BUCKET_LIKES_PATH).delete().eq('id', like.id)
        }
      }

      // まず comments を取得
      const { data: comments } = await supabase
      .from(SUPABASE_BUCKET_COMMENTS_PATH)
      .select(`*`)
      .eq("photoId", id)

      // likes を全削除
      // FIXME: いい感じにバックエンド側で削除できないか？
      if (comments) {
        for (const comment of comments) {
          await supabase.from(SUPABASE_BUCKET_COMMENTS_PATH).delete().eq('id', comment.id)
        }
      }

      // レコード削除
      await supabase.from(SUPABASE_BUCKET_PHOTOS_PATH).delete().eq('id', id)
      toast.success('削除しました')
      Router.push(`/user/${photoData?.user?.id}`)
    } catch (error) {
      console.log(error)
      toast.error('削除に失敗しました。')
    }
  }

  return (
    <Main>
      <h2 className="text-xl mb-4">画像編集</h2>
      <div>
        <Image className='w-4/12' src={photoData.src} alt="image" width={300} height={200} layout='fixed' objectFit={"cover"} />
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
          <label htmlFor="title">画像タイトル</label>
          <input id="title" className='py-1 px-2 border-2 w-80' {...register("title", { required: true })} />
          {errors.title && <span>This field is required</span>}

          <label htmlFor="is_published" className='mt-4'>公開状態</label>
          <input type="checkbox" id="is_published" className='py-1 px-2 border-2' {...register("is_published")} />

          <input className='mt-6 border-gray-300 border-2 rounded p-1 w-12' type="submit" value={'更新'} />
        </form>
      </div>
      <div className='mt-4'>
        <button onClick={() => handleDelete(photoData.id)} className='border-gray-300 border-2 rounded p-1 w-12'>削除</button>
      </div>
    </Main>
  )
}
