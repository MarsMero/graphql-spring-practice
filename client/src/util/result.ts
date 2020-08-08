export type Maybe<A> = {
  map: <B>(cb: (arg: A) => B) => Maybe<B>
  alt: <B>(value: B) => Maybe<A | B>
  cata: <B, C>(obj: {
    None: () => C
    Some: (arg: A) => B
  }) => B|C
  isNone: () => boolean
  isSome: () => boolean
}

export const Some = <A>(arg: A): Maybe<A> => ({
  map: <B>(cb: (a: A) => B): Maybe<B> => Some(cb(arg)),
  alt: () => Some(arg),
  cata: obj => obj.Some(arg),
  isNone: () => false,
  isSome: () => true
});

export type Nothing = Maybe<any>;

export const None: Nothing = ({
  map: (): Nothing => None,
  alt: a => Some(a),
  cata: obj => obj.None(),
  isNone: () => true,
  isSome: () => false
});

export type Result<E, O> = {
  ap: <A>(r: Result<E,A>) => Result<E,A>
  map: <A>(cb: (arg: O) => A) => Result<E,A>
  cata: <A,B>(obj: {
    Err: (arg: E) => A
    Ok: (arg: O) => B
  }) => A | B
  errOrElse: (other?: E) => E
  okOrElse: (other?: O) =>  O
  isErr: () => boolean
  isOk: () => boolean
}


export const Ok = <O>(arg: O): Result<any, O> => ({
  ap: <A>(r: Result<any, A>) => {
    const fun = arg as any;
    return r.map(x => fun(x))
  },
  map: <A>(cb: (a: O) => A): Result<any, A> => Ok(cb(arg)),
  cata: obj => obj.Ok(arg),
  errOrElse: other => other,
  okOrElse: _ => arg,
  isErr: () => false,
  isOk: () => true
});

export const Err = <E>(arg: E): Result<E, any> => ({
  ap: () => Err(arg),
  map: () => Err(arg),
  cata: obj => obj.Err(arg),
  errOrElse: _ => arg,
  okOrElse: other => other,
  isErr: () => true,
  isOk: () => false
});

export function JustOk(): Result<any, Nothing> {
  return Ok(None);
} 

export function JustErr(): Result<Nothing, any> {
  return Err(None);
}