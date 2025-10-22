'use client'

import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { useAuth } from '../../contexts/AuthContext'
import Link from 'next/link'

interface NavigationItem {
  name: string;
  href: string;
  icon?: any;
}

interface MobileNavProps {
  navigation: NavigationItem[];
}

export default function MobileNav({ navigation }: MobileNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = router.pathname

  return (
    <header className="bg-card sticky top-0 z-50 border-b border-border backdrop-blur">
      <nav className="w-full flex items-center justify-between p-4 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">NatFit Pro</span>
            <div className="h-8 w-auto font-bold text-primary">NatFit Pro</div>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-center lg:gap-x-16">
          {navigation.map((item) => {
            const hrefVal = item.href === '#' ? '#' : (item.href.endsWith('/') ? item.href : item.href + '/')
            const isActive = item.href !== '#' && (pathname === item.href || pathname === hrefVal)
            return item.href === '#' ? (
              <a
                key={item.name}
                href="#"
                className={`text-sm font-semibold leading-6 ${isActive ? 'text-primary' : 'text-foreground'} hover:text-primary`}
              >
                {item.icon ? <item.icon className="h-4 w-4 inline mr-1 align-text-bottom" aria-hidden="true" /> : null}
                {item.name}
              </a>
            ) : (
              <Link
                key={item.name}
                href={hrefVal}
                className={`text-sm font-semibold leading-6 ${isActive ? 'text-primary' : 'text-foreground'} hover:text-primary`}
              >
                {item.icon ? <item.icon className="h-4 w-4 inline mr-1 align-text-bottom" aria-hidden="true" /> : null}
                {item.name}
              </Link>
            )
          })}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-foreground/80">{user.email}</span>
              <button
                onClick={logout}
                className="text-sm font-semibold leading-6 text-foreground hover:text-primary"
              >Sair</button>
            </>
          ) : (
            (() => {
              const loginActive = pathname === '/login' || pathname === '/login/'
              return (
                <Link href="/login/" className={`text-sm font-semibold leading-6 ${loginActive ? 'text-primary' : 'text-foreground'} hover:text-primary`}>
                  Login <span aria-hidden="true">&rarr;</span>
                </Link>
              )
            })()
          )}
        </div>
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-card px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">NatFit Pro</span>
              <div className="h-8 w-auto font-bold text-primary">NatFit Pro</div>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-border">
              <div className="space-y-2 py-6">
                {navigation.map((item) => {
                  const hrefVal = item.href === '#' ? '#' : (item.href.endsWith('/') ? item.href : item.href + '/')
                  const isActive = item.href !== '#' && (pathname === item.href || pathname === hrefVal)
                  return item.href === '#' ? (
                    <a
                      key={item.name}
                      href="#"
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${isActive ? 'text-primary' : 'text-foreground'} hover:bg-secondary`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon ? <item.icon className="h-5 w-5 inline mr-2 align-text-bottom" aria-hidden="true" /> : null}
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      href={hrefVal}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 ${isActive ? 'text-primary' : 'text-foreground'} hover:bg-secondary`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon ? <item.icon className="h-5 w-5 inline mr-2 align-text-bottom" aria-hidden="true" /> : null}
                      {item.name}
                    </Link>
                  )
                })}
              </div>
              <div className="py-6">
                {user ? (
                  <div className="flex items-center justify-between -mx-3 rounded-lg px-3 py-2.5">
                    <span className="text-base text-foreground/80">{user.email}</span>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false) }}
                      className="text-base font-semibold leading-7 text-foreground hover:text-primary"
                    >Sair</button>
                  </div>
                ) : (
                  (() => {
                    const loginActive = pathname === '/login' || pathname === '/login/'
                    return (
                      <Link
                        href="/login/"
                        className={`-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 ${loginActive ? 'text-primary' : 'text-foreground'} hover:bg-secondary`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    )
                  })()
                )}
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}