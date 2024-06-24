declare module "odd/dist/core/eval.js" {
	const _eval: (
		tree: object,
		env: object,
		input: string
	) => readonly [any, object, object];
	export default _eval;
}

declare module "odd/dist/core/odd.js" {
	import { Tree } from "odd/dist/core/parse.js";
	const parse: (text: string) => Tree;
	export const defaultEnv: Record<string, any>;
	export default parse;
}

declare module "odd/dist/core/parse.js" {
	export type Token = Readonly<{
		type?: string | undefined;
		text: string;
		offset: number;
		size: number;
	}>;

	export type Tree = Branch | Token;

	export type Branch = Readonly<{
		type: string;
		children: ReadonlyArray<Tree>;
		offset: number;
		size: number;
	}>;
}

declare module "odd/dist/core/util.js" {
	export const ansi: {
		clear: (string: string) => string;
	};
}
