import React, { useState } from 'react'
import Image from 'next/image'
import { v4 as uuidv4 } from 'uuid';

import { SubmitHandler, useForm } from 'react-hook-form'
import { Profile } from '../../../hooks/useUser'
import { supabase } from '../../../utils/supabaseClient'
import { Main } from '../../ui/Main'
import Router from 'next/router';
import { toast } from 'react-toastify';
import { SUPABASE_BUCKET_PHOTOS_PATH } from '../../../utils/const';
import { removeBucketPath } from '../../../utils/removeBucketPath';

type props = {
  user: Profile
}

type Inputs = {
  title: string,
  is_published: boolean
  image: File
};

export const UserPhotoNew: React.FC<props> = ({ user }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>();
  const [newImage, setImage] = useState<File | null>()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    const size = file.size

    if (size > 1000000) {
      toast.error('ファイルサイズは1MB以内にしてください。')
      reset()
      setPreviewUrl(null)
      setImage(null)

      return
    }

    setImage(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const onSubmit: SubmitHandler<Inputs> = async (data, event): Promise<void> => {
    const { title, is_published } = data

    if (!newImage) return

    const uuid = uuidv4()
    const newImageKey = uuid.split('-')[uuid.split('-').length - 1]

    try {
      // storage に画像をアップロード
      const { data: inputData } = await supabase
        .storage
        .from(SUPABASE_BUCKET_PHOTOS_PATH)
        .upload(`${user.id}/${newImageKey}`, newImage, {
          cacheControl: '3600',
          upsert: false
        })

      const key = inputData?.Key

      if (!key) {
        throw new Error("Error")
      }

      const { publicURL } = supabase.storage.from(SUPABASE_BUCKET_PHOTOS_PATH).getPublicUrl(removeBucketPath(key, SUPABASE_BUCKET_PHOTOS_PATH))

      // DBにレコード作成
      await supabase.from(SUPABASE_BUCKET_PHOTOS_PATH).insert([{
        userId: user.id,
        title: title,
        is_published: is_published,
        src: publicURL
      }])

      toast.success("画像を投稿しました！")
      Router.push(`/user/${user.id}`)
    } catch(error) {
      console.log(error)
      toast.error("エラーが発生しました。")
    }
  }

  return (
    <Main>
      <h2 className="text-xl mb-4">新規投稿</h2>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
          <label htmlFor="title">画像タイトル</label>
          <input id="title" className='py-1 px-2 border-2 w-80' {...register("title", { required: true })} />
          {errors.title && <span>This field is required</span>}

          <label htmlFor="is_published" className='mt-4'>公開状態</label>
          <input type="checkbox" id="is_published" className='py-1 px-2 border-2 w-4' {...register("is_published")} />

          <label htmlFor="image" className='mt-4'>画像を選択</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            multiple
            {...register("image", { onChange: handleFile, required: true })}
          />
          {previewUrl && (
            <div className='mt-4'>
              <Image className='w-4/12' src={previewUrl} alt="image" width={300} height={200} layout='fixed' objectFit={"cover"} />
            </div>
          )}

          <input className='border-gray-300 border-2 rounded p-1 w-16 mt-4' type="submit" />
        </form>
      </div>
    </Main>
  )
}
