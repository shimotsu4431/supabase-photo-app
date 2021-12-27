import React from 'react'
import Image from 'next/image'

import { Profile } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'
import { PublicPhoto } from '../../../types/publicPhoto'
import Link from 'next/link'

type props = {
  user: Profile
  photoData: PublicPhoto
}

export const UserPhoto: React.FC<props> = ({ user, photoData }) => {
  console.log("photoData", photoData)

  return (
    <Main>
      <h2 className="text-xl mb-2">{photoData.title}</h2>
      <div>
        <Image className='w-4/12' src={photoData.src} alt="image" width={300} height={200} layout='fixed' objectFit={"contain"} />
      </div>
      <div className='mt-4 pt-4 border-t-2'>
        <h3 className='text-xl mb-4 font-bold'>コメント一覧</h3>
        <ul className=''>
          {photoData.comments.map((c) => {
            return (
              <li key={c.id} className='border-2 p-4'>
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
                {user.id === c.userId && (
                  <div className='mt-4'>
                    <button className='mr-2 underline'>編集</button>
                    <button className='underline'>削除</button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </Main>
  )
}
