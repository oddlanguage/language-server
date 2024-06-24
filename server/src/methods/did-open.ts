import { documents } from "../documents.js";
import { RequestMessage } from "../server.js";

type TextDocumentItem = Readonly<{
	uri: string;
	languageId: string;
	version: number;
	text: string;
}>;

type DidOpenMessage = RequestMessage<{
	textDocument: TextDocumentItem;
}>;

const didOpen = (message: DidOpenMessage) => {
	if (!message.params) return;
	documents.set(
		message.params.textDocument.uri,
		message.params.textDocument.text
	);
};

export default didOpen;
