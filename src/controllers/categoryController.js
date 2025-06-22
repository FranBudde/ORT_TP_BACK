import { getCategoryByName } from "../service/categoryService.js";

export async function handleGetCategoryByName(req, res) {
  const name = req.params.name;

  try {
    const category = await getCategoryByName(name);
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.json({ id: category._id });
  } catch (error) {
    console.error("Error en handleGetCategoryByName:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
}
