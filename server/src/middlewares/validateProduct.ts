import { Request, Response, NextFunction } from 'express';

export const validateProduct = (req: Request, res: Response, next: NextFunction): void => {
  const { name, price } = req.body;

  if (!name || !price) {
    res.status(400).json({ message: "Product name and price are required" });
    return;
  }

  next();
};

