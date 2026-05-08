import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

// Simple wishlist stored as customer metadata
export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { customerId } = req.params
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: customers } = await query.graph({
    entity: "customer",
    fields: ["id", "metadata"],
    filters: { id: customerId },
  })

  const customer = customers[0]
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" })
  }

  const wishlist = (customer.metadata as any)?.wishlist ?? []

  return res.json({ wishlist })
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { customerId } = req.params
  const { product_id } = req.body as { product_id: string }
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: customers } = await query.graph({
    entity: "customer",
    fields: ["id", "metadata"],
    filters: { id: customerId },
  })

  const customer = customers[0]
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" })
  }

  const currentWishlist: string[] =
    (customer.metadata as any)?.wishlist ?? []

  let updatedWishlist: string[]
  if (currentWishlist.includes(product_id)) {
    updatedWishlist = currentWishlist.filter((id) => id !== product_id)
  } else {
    updatedWishlist = [...currentWishlist, product_id]
  }

  return res.json({ wishlist: updatedWishlist })
}
