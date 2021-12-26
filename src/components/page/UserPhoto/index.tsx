import React from 'react'
import Image from 'next/image'

import { Profile } from '../../../hooks/useUser'
import { Main } from '../../ui/Main'
import { PublicPhoto } from '../../../types/publicPhoto'

type props = {
  user: Profile
  photoData: PublicPhoto
}

export const UserPhoto: React.FC<props> = ({ user, photoData }) => {

  return (
    <Main>
      <h2 className="text-xl mb-2">{photoData.title}</h2>
      <div>
        <Image className='w-4/12' src={photoData.src} alt="image" width={300} height={200} layout='fixed' objectFit={"contain"} />
      </div>
    </Main>
  )
}
