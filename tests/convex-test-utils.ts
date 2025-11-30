import { jest } from '@jest/globals'
import * as ConvexReact from 'convex/react'

export function mockConvexHooks<T>({ queryData }: { queryData?: T }) {
  jest.spyOn(ConvexReact, 'useQuery').mockImplementation(() => queryData as T)
  jest.spyOn(ConvexReact, 'useMutation').mockImplementation(() => {
    const fn = ((): Promise<void> => Promise.resolve()) as unknown as ReturnType<typeof ConvexReact.useMutation>
    ;(fn as unknown as { withOptimisticUpdate: (cb: unknown) => unknown }).withOptimisticUpdate = () => fn
    return fn
  })
}
