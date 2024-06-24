import { RequestMessage } from "../server.js";

type ServerCapabilities = Readonly<{
	[K in string]: unknown;
}>;

type InitResult = Readonly<{
	capabilities: ServerCapabilities;
	serverInfo?: Readonly<{
		name: string;
		version?: string;
	}>;
}>;

const initialize = (
	message: RequestMessage
): InitResult => ({
	capabilities: {
		completionProvider: {},
		textDocumentSync: 1,
		diagnosticProvider: {
			interFileDependencies: false,
			workspaceDiagnostics: false
		}
	},
	serverInfo: {
		name: "odd-language-server",
		version: "1.0.0"
	}
});

export default initialize;
