// https://stackoverflow.com/a/46944148

interface Func<T> {
    ([...args]: any, args2?: any): T // tslint:disable-line
}

/**
 * This function returns the return type of func
 * @param {Func<T>} func
 * @returns {T}
 */
export function returnType<T>(func: Func<T>): T {
    return (false as any) as T
}

interface Dispatcher<T> {
    ([...args]: any): Func<T>
}

type DispatcherObj<K> = { [P in keyof K]: Func<K[P]> }

export const dispatchReturnType = <T>(dispatchers: DispatcherObj<T>) => {
    return (false as any) as T
}

export interface DefaultToAny {
    [key: string]: any
}
