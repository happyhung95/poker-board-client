import React from 'react'
import { Transition as TailwindTransaction } from '@tailwindui/react'

type Props = {
  id?: string
  children: React.ReactNode
  showCondition: boolean
  durationEnter?: '75' | '100' | '150' | '200' | '300' | '500' | '700' | '1000'
  durationLeave?: '75' | '100' | '150' | '200' | '300' | '500' | '700' | '1000'
}

export const Transition = ({
  id = '',
  children,
  showCondition,
  durationEnter = '200',
  durationLeave = '100',
}: Props) => (
  <TailwindTransaction
    id={id}
    show={showCondition}
    enter={`transition ease-out duration-${durationEnter} transform`}
    enterFrom="opacity-0 scale-95"
    enterTo="opacity-100 scale-100"
    leave={`transition ease-out duration-${durationLeave} transform`}
    leaveFrom="opacity-100 scale-100"
    leaveTo="opacity-0 scale-95"
  >
    {children}
  </TailwindTransaction>
)
