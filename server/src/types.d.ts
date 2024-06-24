export type Position = Readonly<{
	line: number;
	character: number;
}>;

export type Range = Readonly<{
	start: Position;
	end: Position;
}>;
