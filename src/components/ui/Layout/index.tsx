import React from 'react'
import { Header } from '../Header'
import { Menu } from '../Menu'

export const Layout: React.FC = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Menu />
      {children}
    </div>
  )
}
