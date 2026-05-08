import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const {
    condition,
    condition_grade,
    ram,
    processor,
    storage_type,
    warranty_months,
    min_price,
    max_price,
    category_id,
    collection_id,
    q,
    limit = "24",
    offset = "0",
    order,
  } = req.query as Record<string, string>

  const filters: Record<string, any> = {
    status: "published",
  }

  if (category_id) {
    filters.categories = { id: category_id }
  }

  if (collection_id) {
    filters.collection_id = collection_id
  }

  if (q) {
    filters.title = { $ilike: `%${q}%` }
  }

  const { data: products, metadata } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "handle",
      "description",
      "metadata",
      "thumbnail",
      "status",
      "created_at",
      "collection.id",
      "collection.title",
      "collection.handle",
      "categories.id",
      "categories.name",
      "categories.handle",
      "variants.id",
      "variants.title",
      "variants.sku",
      "variants.calculated_price.*",
      "images.url",
      "tags.value",
    ],
    filters,
    pagination: {
      take: parseInt(limit),
      skip: parseInt(offset),
    },
  })

  // Filter by metadata fields (client-side post-filter for custom metadata)
  let filteredProducts = products as any[]

  if (condition) {
    const conditions = condition.split(",")
    filteredProducts = filteredProducts.filter((p) =>
      conditions.includes(p.metadata?.condition)
    )
  }

  if (condition_grade) {
    const grades = condition_grade.split(",")
    filteredProducts = filteredProducts.filter((p) =>
      grades.includes(p.metadata?.condition_grade)
    )
  }

  if (ram) {
    const ramValues = ram.split(",").map(Number)
    filteredProducts = filteredProducts.filter((p) =>
      ramValues.includes(p.metadata?.ram_gb)
    )
  }

  if (processor) {
    const procs = processor.toLowerCase().split(",")
    filteredProducts = filteredProducts.filter((p) =>
      procs.some((proc) =>
        p.metadata?.processor?.toLowerCase().includes(proc)
      )
    )
  }

  if (storage_type) {
    const storageTypes = storage_type.split(",")
    filteredProducts = filteredProducts.filter((p) =>
      storageTypes.includes(p.metadata?.storage_type)
    )
  }

  if (warranty_months) {
    const minWarranty = parseInt(warranty_months)
    filteredProducts = filteredProducts.filter(
      (p) => (p.metadata?.warranty_months ?? 0) >= minWarranty
    )
  }

  return res.json({
    products: filteredProducts,
    count: filteredProducts.length,
    offset: parseInt(offset),
    limit: parseInt(limit),
  })
}
