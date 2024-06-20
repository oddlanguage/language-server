declare module "odd/dist/core/eval.js" {
	const _eval: (
		tree: object,
		env: object,
		input: string
	) => readonly [any, object, object];
	export default _eval;
}

declare module "odd/dist/core/odd.js" {
	const parse: (text: string) => object;
	export const defaultEnv: Record<string, any>;
	export default parse;
}
