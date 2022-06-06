import type { ComponentAttributes } from '../../_internals/types'


type BtnClickEv = React.MouseEvent<HTMLButtonElement>

type BtnProps = ComponentAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>


export type { BtnClickEv, BtnProps }