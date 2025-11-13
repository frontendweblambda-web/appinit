export type Nullable<T> = T | null | undefined;
export type Maybe<T> = T | null | undefined;

export type ID = string;
export type JSONValue =
	| string
	| number
	| boolean
	| null
	| JSONValue[]
	| { [key: string]: JSONValue };
