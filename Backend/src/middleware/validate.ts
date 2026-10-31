import type { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

export function validate(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten() });
    }

    if (
      typeof result.data === "object" &&
      result.data !== null &&
      "body" in result.data
    ) {
      req.body = result.data.body;
    }

    next();
  };
}
