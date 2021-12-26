import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Profile } from '../../../hooks/useUser'
import { supabase } from '../../../utils/supabaseClient'
import { Main } from '../../ui/Main'
import { PublicPhoto } from '../../../types/publicPhoto'
import Link from 'next/link'

type props = {
  user: Profile
  publicPhotos: PublicPhoto[]
}

export const UserDetail: React.FC<props> = ({ user, publicPhotos }) => {
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
          {publicPhotos.map((p, idx) => {
            return (
              <li key={p.id} className='mb-6'>
                <h3 className='text-xl'>{p.title}</h3>
                <Link href={`/${user.fullname}/photo/${p.key}`}>
                  <a>
                    <Image src={p.src} width={300} height={200} alt={p.title}></Image>
                  </a>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </Main>
  )
}
