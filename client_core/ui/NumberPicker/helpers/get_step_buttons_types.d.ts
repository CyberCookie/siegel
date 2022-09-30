import type { ReactTagAttributes } from '../../_internals/types'


type BtnClickEv = React.MouseEvent<HTMLButtonElement>

type BtnProps = ReactTagAttributes<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>


export type { BtnClickEv, BtnProps }