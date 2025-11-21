import { ZodError } from "zod";

export const formatError = (error: ZodError) => {
	return error.issues.map(({ message }) => message)[0];
};
