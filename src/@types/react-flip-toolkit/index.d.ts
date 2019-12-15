declare module 'react-flip-toolkit' {
  export interface Spring {
    stiffness?: number
    damping?: number
    overshootClamping?: boolean
  }

  export type SpringConfig = 'noWobble' | 'veryGentle' | 'gentle' | 'wobbly' | 'stiff' | Spring

  export type FlippedComponentIdFilter = string | any[]

  export interface FlippedWithContextProps {
    children: React.ReactNode
    inverseFlipId?: string
    flipId?: string
    opacity?: boolean
    translate?: boolean
    scale?: boolean
    transformOrigin?: string
    stagger?: string | boolean
    spring?: SpringConfig
    onStart?: (element: HTMLElement) => any
    onComplete?: (element: HTMLElement) => any
    onAppear?: (element: HTMLElement, index: number) => any
    onDelayedAppear?: (element: HTMLElement, index: number) => any
    onExit?: (element: HTMLElement, index: number, removeElement: () => any) => any
    componentIdFilter?: FlippedComponentIdFilter
    componentId?: string
    portalKey?: string
  }

  export const FlippedWithContext: React.SFC<FlippedWithContextProps>
  export const Flipped: React.SFC<FlippedWithContextProps>

  export interface FlipperProps {
    flipKey: any
    children: React.ReactNode
    spring?: SpringConfig
    applyTransformOrigin?: boolean
    debug?: boolean
    element?: string
    className?: string
    portalKey?: string
    jitterFix?: boolean
  }

  export class Flipper extends React.Component<FlipperProps, any> {
    render(): JSX.Element
  }
}
