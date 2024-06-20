import * as fs from "node:fs";

export const create = (path: string) => {
	const stream = fs.createWriteStream(path, "utf-8");
	const write = (data: any, prefix?: string) =>
		stream.write(
			"[" +
				(prefix ?? "") +
				new Date().toISOString() +
				"]: " +
				(typeof data === "object"
					? JSON.stringify(data)
					: data?.toString() ?? "null") +
				"\n"
		);

	const info = (data: any) => write(data, "INFO ");
	const error = (data: any) => write(data, "ERROR ");
	const warn = (data: any) => write(data, "WARN ");

	return { warn, error, info };
};
