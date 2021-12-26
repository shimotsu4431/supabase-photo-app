import React from 'react'
import Image from 'next/image'
import { Profile, useUser } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'
import { PublicPhoto } from '../../../types/publicPhoto'
import Link from 'next/link'

type props = {
  user: Profile
  publicPhotos: PublicPhoto[]
}

export const UserDetail: React.FC<props> = ({ user, publicPhotos }) => {
  const { user: sessionUser } = useUser()

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
                <Link href={`/${user.fullname}/photo/${p.id}`}>
                  <a>
                    <Image src={p.src} width={300} height={200} alt={p.title}></Image>
                  </a>
                </Link>
                {sessionUser?.id === user.id && (
                  <>
                    <div className='inline-block'>
                      公開ステータス: {p.isPublished ? "公開" : "未公開"}
                    </div>
                    <div className='inline-block'>
                      <Link href={`/${user.fullname}/photo/${p.id}/edit`}><a className='underline'>編集</a></Link>
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
