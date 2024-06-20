export type TextDocumentChangeEvent = Readonly<{
	text: string;
}>;

export type TextDocumentIdentifier = Readonly<{
	uri: string;
}>;

export type VersionedTextDocumentIdentifier =
	TextDocumentIdentifier &
		Readonly<{
			version: number;
		}>;

export const documents = new Map<string, string>();
