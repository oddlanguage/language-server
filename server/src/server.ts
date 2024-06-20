import { create } from "./logger.js";
import completion from "./methods/completion.js";
import didChange from "./methods/did-change.js";
import initialize from "./methods/initialize.js";

export const logger = create("C:/Git/odd-lsp/tmp.log");

type Message = Readonly<{
	jsonrpc: string;
}>;

export type RequestMessage<
	Params extends Readonly<Record<string, any>> = {}
> = Message &
	Readonly<{
		id: number | string;
		method: string;
		params?: Params;
	}>;

type Result =
	| string
	| number
	| boolean
	| object
	| null
	| undefined
	| void
	| ReadonlyArray<Result>;

const handlers: Readonly<
	Record<
		string,
		(message: RequestMessage<any>) => Result
	>
> = {
	initialize,
	"textDocument/completion": completion,
	"textDocument/didChange": didChange
};

const respond = (
	id: RequestMessage["id"],
	result: Result
) => {
	if (
		[null, undefined].includes(
			result as null | undefined
		)
	) {
		return;
	}
	const message = { id, result };
	const body = JSON.stringify(message);
	const header =
		"Content-Length: " +
		Buffer.byteLength(body, "utf8") +
		"\r\n\r\n";
	const response = header + body;

	logger.info(message);
	process.stdout.write(response);
};

const header = "Content-Length: ";
const separator = "\r\n\r\n";
const regex = new RegExp(
	`^${header}(\\d+)${separator}`
);

let buffer = "";
process.stdin.on("data", chunk => {
	buffer += chunk;

	while (true) {
		const unparsedSize = buffer.match(regex)?.[1];

		if (!unparsedSize) break;

		const size = parseInt(unparsedSize);
		const bodyStart =
			header.length +
			unparsedSize.length +
			separator.length;
		const bodyEnd = bodyStart + size;

		if (buffer.length < bodyEnd) break;

		const message = JSON.parse(
			buffer.slice(bodyStart, bodyEnd)
		) as RequestMessage;

		logger.info(message);
		const handler = handlers[message.method];
		if (handler) {
			respond(message.id, handler(message));
		}

		buffer = buffer.slice(bodyEnd);
	}
});
