import React, { useCallback } from 'react'
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
  publicPhotos: PublicPhoto[]
}

export const UserDetail: React.FC<props> = ({ user, publicPhotos }) => {
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
    <Main>
      <h2 className="text-xl mb-4">{user.nickname} さんの画像一覧</h2>
      <Image
          src={user.avatarurl ?? ""}
          width={48}
          height={48}
          alt={user.fullname ?? ""}
      />
      <div className='py-2'>
        <ul>
          {publicPhotos.map((p) => {
            if (sessionUser?.id !== user.id && !p.isPublished) return null

            return (
              <li key={p.id} className='mb-6 flex flex-col'>
                <h3 className='text-xl'>{p.title}</h3>
                <div>
                  <Link href={`/${user.fullname}/photo/${p.id}`}>
                    <a className='inline-block'>
                      <Image src={p.src} width={300} height={200} alt={p.title}></Image>
                    </a>
                  </Link>
                </div>
                {sessionUser?.id === user.id && (
                  <>
                    <div className='inline-block'>
                      公開ステータス: {p.isPublished ? "公開" : "未公開"}
                    </div>
                    <div className='inline-block'>
                      <Link href={`/${user.fullname}/photo/${p.id}/edit`}><a className='underline'>編集</a></Link>
                    </div>
                    <div>
                      <button onClick={() => handleDelete(p.id)} className='mt-2 border-2 w-1/12 border-red-500'>削除</button>
                    </div>
                  </>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </Main>
  )
}
