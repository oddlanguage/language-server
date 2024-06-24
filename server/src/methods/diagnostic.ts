import parse, {
	defaultEnv
} from "odd/dist/core/odd.js";
import {
	Branch,
	Token,
	Tree
} from "odd/dist/core/parse.js";
import { ansi } from "odd/dist/core/util.js";
import {
	documents,
	TextDocumentIdentifier
} from "../documents.js";
import { RequestMessage } from "../server.js";
import { Position, Range } from "../types.js";

namespace DiagnosticSeverity {
	export const Error: 1 = 1;
	export const Warning: 2 = 2;
	export const Information: 3 = 3;
	export const Hint: 4 = 4;
}

type DiagnosticSeverity = 1 | 2 | 3 | 4;

type Diagnostic<T = unknown> = Readonly<{
	range: Range;
	severity: DiagnosticSeverity;
	source: "Odd";
	message: string;
	data?: T;
}>;

type FullDocumentDiagnosticReport = Readonly<{
	kind: "full";
	items: ReadonlyArray<Diagnostic>;
}>;

type DiagnosticMessage = RequestMessage<{
	textDocument: TextDocumentIdentifier;
}>;

const knownSymbols = Object.keys(defaultEnv);

const flatten = (tree: Tree): ReadonlyArray<Token> => {
	if ((tree as Token).text !== undefined)
		return [tree as Token];
	return (tree as Branch).children.flatMap(flatten);
};

const offsetToPosition = (
	offset: number,
	input: string
): Position => {
	const character =
		offset - (input.lastIndexOf("\n", offset) + 1);
	const line =
		input.slice(0, offset).split(/\n/).length - 1;
	return { line, character };
};

const diagnostic = (
	message: DiagnosticMessage
): FullDocumentDiagnosticReport | undefined => {
	if (!message.params) return;

	const content = documents.get(
		message.params.textDocument.uri
	);
	if (content === undefined) return;

	try {
		const items: ReadonlyArray<Diagnostic> = flatten(
			parse(content)
		)
			.filter(
				({ type, text }) =>
					["name", "operator"].includes(type!) &&
					!knownSymbols.includes(text)
			)
			.map(token => ({
				range: {
					start: offsetToPosition(
						token.offset,
						content
					),
					end: offsetToPosition(
						token.offset + token.size,
						content
					)
				},
				severity: DiagnosticSeverity.Error,
				source: "Odd",
				message: `Unknown name "${token.text}".`
			}));

		return { kind: "full", items };
	} catch (err) {
		if (typeof err !== "string") return;
		return {
			kind: "full",
			items: [
				{
					range: {
						start: { line: 0, character: 0 },
						end: { line: 0, character: 1 }
					},
					severity: DiagnosticSeverity.Error,
					source: "Odd",
					message: ansi.clear(err)
				}
			]
		};
	}
};

export default diagnostic;
