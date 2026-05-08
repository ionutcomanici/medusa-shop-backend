import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: [
      "id",
      "name",
      "handle",
      "description",
      "rank",
      "is_active",
      "parent_category_id",
      "parent_category.id",
      "parent_category.name",
      "parent_category.handle",
      "category_children.id",
      "category_children.name",
      "category_children.handle",
      "category_children.rank",
    ],
    filters: {
      is_active: true,
      is_internal: false,
    },
  })

  return res.json({ categories })
}
