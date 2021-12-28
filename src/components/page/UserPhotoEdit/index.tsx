import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import { SubmitHandler, useForm } from 'react-hook-form'
import { Profile } from '../../../hooks/useUser'
import { supabase } from '../../../utils/supabaseClient'
import { Main } from '../../ui/Main'
import Router from 'next/router';
import { toast } from 'react-toastify';
import { PublicPhoto } from '../../../types/publicPhoto';

type props = {
  user: Profile
  photoData: PublicPhoto
}

type Inputs = {
  title: string,
  isPublished: boolean
};

export const UserPhotoEdit: React.FC<props> = ({ user, photoData }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<Inputs>();

  useEffect(() => {
    setValue("title", photoData.title)
    setValue("isPublished", photoData.isPublished)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const onSubmit: SubmitHandler<Inputs> = async (data, event): Promise<void> => {
    const { title, isPublished } = data

    try {
      // レコード更新
      await supabase
        .from('photos')
        .update({
          title: title,
          is_published: isPublished,
        })
        .match({ id: photoData.id })

      toast.success("画像を更新しました！")
      Router.push(`/${user.fullname}`)
    } catch(error) {
      console.log(error)
      toast.error("エラーが発生しました。")
    }
  }

  return (
    <Main>
      <h2 className="text-xl mb-4">画像編集</h2>
      <div>
        <Image className='w-4/12' src={photoData.src} alt="image" width={300} height={200} layout='fixed' objectFit={"contain"} />
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
          <label htmlFor="title">画像タイトル</label>
          <input id="title" className='py-1 px-2 border-2 w-80' {...register("title", { required: true })} />
          {errors.title && <span>This field is required</span>}

          <label htmlFor="isPublished" className='mt-4'>公開状態</label>
          <input type="checkbox" id="isPublished" className='py-1 px-2 border-2' {...register("isPublished")} />

          <input className='mt-6 border-gray-300 border-2 rounded p-1 w-12' type="submit" />
        </form>
      </div>
    </Main>
  )
}
