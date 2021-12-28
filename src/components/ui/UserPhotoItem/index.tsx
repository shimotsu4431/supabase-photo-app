import React, { useCallback } from 'react'
import Image from 'next/image'
import { Profile, useUser } from '../../../hooks/useUser'
import { PublicPhoto } from '../../../types/publicPhoto'
import Link from 'next/link'
import { supabase } from '../../../utils/supabaseClient'
import { toast } from 'react-toastify'
import Router from 'next/router'

type props = {
  user: Profile
  publicPhoto: PublicPhoto
}

export const UserPhotoItem: React.FC<props> = ({ user, publicPhoto }) => {
  const { user: sessionUser } = useUser()

  const handleDelete = useCallback(async (id: number) => {
    if (!window.confirm("削除しますか？")) return

    try {
      await supabase.from('photos').delete().eq('id', id)
      toast.success('削除しました')
      Router.push(`/${user.fullname}`)
    } catch (error) {
      console.log(error)
      toast.error('削除に失敗しました。')
    }
  },[user.fullname])

  return (
    <li key={publicPhoto.id} className='mb-6 flex flex-col'>
      <h3 className='text-2xl mb-2'>{publicPhoto.title}</h3>
      <div>
        <Link href={`/${user.fullname}/photo/${publicPhoto.id}`}>
          <a className='inline-block'>
            <Image src={publicPhoto.src} width={300} height={200} alt={publicPhoto.title}></Image>
          </a>
        </Link>
      </div>
      <div>
        コメント数: <Link href={`/${user.fullname}/photo/${publicPhoto.id}#comments`}><a className='px-1 underline'>{publicPhoto.comments?.length ?? 0}</a></Link>件
      </div>
      {sessionUser?.id === user.id && (
        <div className='flex flex-col pt-2'>
          <div className='inline-block'>
            isPublished: {publicPhoto.isPublished ? "true" : "false"}
          </div>
          <div className='flex'>
            <div>
              <button onClick={() => Router.push(`/${user.fullname}/photo/${publicPhoto.id}/edit`)} className='border-gray-300 border-2 rounded p-1 w-12 mr-2'>編集</button>
            </div>
            <div>
              <button onClick={() => handleDelete(publicPhoto.id)} className='border-gray-300 border-2 rounded p-1 w-12'>削除</button>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
