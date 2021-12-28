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
  publicPhotos: PublicPhoto[]
}

export const UserPhotoList: React.FC<props> = ({ user, publicPhotos }) => {
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
    <ul>
      {publicPhotos.map((p) => {
        if (sessionUser?.id !== user.id && !p.isPublished) return null

        return (
          <li key={p.id} className='mb-6 flex flex-col'>
            <h3 className='text-2xl mb-2'>{p.title}</h3>
            <div>
              <Link href={`/${user.fullname}/photo/${p.id}`}>
                <a className='inline-block'>
                  <Image src={p.src} width={300} height={200} alt={p.title}></Image>
                </a>
              </Link>
            </div>
            <div>
              コメント数: {p.comments?.length ?? 0}件
            </div>
            {sessionUser?.id === user.id && (
              <div>
                <div className='inline-block'>
                  isPublished: {p.isPublished ? "true" : "false"}
                </div>
                <div className='inline-block'>
                  <Link href={`/${user.fullname}/photo/${p.id}/edit`}><a className='underline'>編集</a></Link>
                </div>
                <div>
                  <button onClick={() => handleDelete(p.id)} className='border-gray-300 border-2 rounded p-1 w-12 mt-2 mr-2'>削除</button>
                </div>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
