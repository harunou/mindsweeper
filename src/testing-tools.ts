import { PartialObserver } from 'rxjs';

type SpyObj<T> = T &
    {
        [k in keyof T]: T[k] extends (...args: any[]) => any
            ? T[k] & jest.SpyInstance<T[k], jest.ArgsType<T[k]>>
            : T[k];
    };

export type SpyObserver<T> = SpyObj<PartialObserver<T>>;

export const createObserverSpy = <T>(
    observer?: Partial<SpyObserver<T>>
): SpyObserver<T> => {
    const observerSpy: PartialObserver<T> = {
        next(value?: T): void {},
        error(error?: object): void {
            fail(
                `${__filename}: makeObserverSpy() observer catch error: ${error}`
            );
        },
        complete(): void {},
        ...observer,
    };
    jest.spyOn(observerSpy, 'next');
    jest.spyOn(observerSpy, 'error');
    jest.spyOn(observerSpy, 'complete');
    return observerSpy as SpyObserver<T>;
};
