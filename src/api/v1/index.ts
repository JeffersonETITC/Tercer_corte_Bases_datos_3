import { Router } from "express";
import librosRoutes from "../../modules/biblioteca/libro.routes";

const router = Router();

router.use("/libros", librosRoutes);

export default router;
