import {
	documents,
	type TextDocumentChangeEvent,
	type VersionedTextDocumentIdentifier
} from "../documents.js";
import { type RequestMessage } from "../server.js";

type DidChangeTextDocumentMessage = RequestMessage<{
	textDocument: VersionedTextDocumentIdentifier;
	contentChanges: ReadonlyArray<TextDocumentChangeEvent>;
}>;

const didChange = (
	message: DidChangeTextDocumentMessage
) => {
	const uri = message.params?.textDocument.uri;
	if (!uri) return;
	const text = message.params?.contentChanges[0]?.text;
	if (text?.length === undefined) return;
	documents.set(uri, text);
};

export default didChange;
