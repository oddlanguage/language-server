import _eval from "odd/dist/core/eval.js";
import {
	defaultEnv,
	default as parse
} from "odd/dist/core/odd.js";
import {
	documents,
	TextDocumentIdentifier
} from "../documents.js";
import {
	logger,
	type RequestMessage
} from "../server.js";

type CompletionItem = Readonly<{
	label: string;
}>;

type CompletionList = Readonly<{
	isIncomplete: boolean;
	items: ReadonlyArray<CompletionItem>;
}>;

type Position = Readonly<{
	line: number;
	character: number;
}>;

type TextDocumentCompletionMessage = RequestMessage<{
	textDocument: TextDocumentIdentifier;
	position: Position;
}>;

const completion = (
	message: TextDocumentCompletionMessage
): CompletionList | void => {
	if (!message.params) return;
	const content = documents.get(
		message.params?.textDocument.uri
	);
	if (content === undefined) return;
	const line =
		content.split("\n")[message.params.position.line];
	const lineUntilCursor = line.slice(
		0,
		message.params.position.character
	);

	// Why the fuck would you use a regex replace to
	// extract some bytes here? This is actually insane.
	// TODO: Be a normal human being and extract the
	// text with some string slicing.
	const word = lineUntilCursor.replace(
		/.*\W(.*?)/,
		"$1"
	);

	try {
		const [, , env] = _eval(
			parse(content),
			defaultEnv,
			content
		);

		const items = Object.keys(env)
			.filter(m => m.match(word))
			.map(label => ({ label }));

		return {
			isIncomplete: false,
			items
		};
	} catch (err) {
		logger.error(err);
	}
};

export default completion;
