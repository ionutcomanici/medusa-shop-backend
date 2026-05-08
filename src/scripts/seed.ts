import {
  ExecArgs,
  IProductModuleService,
  IRegionModuleService,
  IStoreModuleService,
  ISalesChannelModuleService,
  IFulfillmentModuleService,
  IPaymentModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function seedDatabase({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("Starting seed...")

  const regionModule: IRegionModuleService = container.resolve(Modules.REGION)
  const storeModule: IStoreModuleService = container.resolve(Modules.STORE)
  const salesChannelModule: ISalesChannelModuleService = container.resolve(
    Modules.SALES_CHANNEL
  )
  const productModule: IProductModuleService = container.resolve(
    Modules.PRODUCT
  )
  const fulfillmentModule: IFulfillmentModuleService = container.resolve(
    Modules.FULFILLMENT
  )
  const paymentModule: IPaymentModuleService = container.resolve(
    Modules.PAYMENT
  )

  // Create Region Romania
  logger.info("Creating region Romania...")
  const [region] = await regionModule.createRegions([
    {
      name: "Romania",
      currency_code: "ron",
      countries: ["ro"],
    },
  ])

  // Create Sales Channel
  logger.info("Creating sales channel...")
  const [salesChannel] = await salesChannelModule.createSalesChannels([
    {
      name: "Webshop",
      description: "Online storefront",
      is_disabled: false,
    },
  ])

  // Update default store
  logger.info("Updating store...")
  const stores = await storeModule.listStores()
  if (stores.length > 0) {
    await storeModule.updateStores(stores[0].id, {
      name: "IT Refurbished Shop",
      supported_currencies: [
        { currency_code: "ron", is_default: true },
      ],
    })
  }

  // Create Product Categories
  logger.info("Creating categories...")

  const [laptopuriCat] = await productModule.createProductCategories([
    {
      name: "Laptopuri",
      handle: "laptopuri",
      is_active: true,
      is_internal: false,
    },
  ])
  const [calculatoareCat] = await productModule.createProductCategories([
    {
      name: "Calculatoare",
      handle: "calculatoare",
      is_active: true,
      is_internal: false,
    },
  ])
  const [monitoareCat] = await productModule.createProductCategories([
    {
      name: "Monitoare",
      handle: "monitoare",
      is_active: true,
      is_internal: false,
    },
  ])
  const [componenteCat] = await productModule.createProductCategories([
    {
      name: "Componente",
      handle: "componente",
      is_active: true,
      is_internal: false,
    },
  ])
  const [accesoriiCat] = await productModule.createProductCategories([
    {
      name: "Accesorii",
      handle: "accesorii",
      is_active: true,
      is_internal: false,
    },
  ])
  const [tableteCat] = await productModule.createProductCategories([
    {
      name: "Tablete & Telefoane",
      handle: "tablete-telefoane",
      is_active: true,
      is_internal: false,
    },
  ])

  // Subcategories Laptopuri
  await productModule.createProductCategories([
    {
      name: "Laptop Second Hand",
      handle: "laptop-second-hand",
      parent_category_id: laptopuriCat.id,
      is_active: true,
      is_internal: false,
    },
    {
      name: "Laptop Refurbished",
      handle: "laptop-refurbished",
      parent_category_id: laptopuriCat.id,
      is_active: true,
      is_internal: false,
    },
    {
      name: "Laptopuri Ieftine",
      handle: "laptopuri-ieftine",
      parent_category_id: laptopuriCat.id,
      is_active: true,
      is_internal: false,
    },
  ])

  // Subcategories Calculatoare
  await productModule.createProductCategories([
    {
      name: "Calculatoare Second Hand",
      handle: "calculatoare-second-hand",
      parent_category_id: calculatoareCat.id,
      is_active: true,
      is_internal: false,
    },
    {
      name: "Calculatoare Refurbished",
      handle: "calculatoare-refurbished",
      parent_category_id: calculatoareCat.id,
      is_active: true,
      is_internal: false,
    },
    {
      name: "Calculatoare Noi",
      handle: "calculatoare-noi",
      parent_category_id: calculatoareCat.id,
      is_active: true,
      is_internal: false,
    },
    {
      name: "All-in-One",
      handle: "all-in-one",
      parent_category_id: calculatoareCat.id,
      is_active: true,
      is_internal: false,
    },
    {
      name: "Workstation",
      handle: "workstation",
      parent_category_id: calculatoareCat.id,
      is_active: true,
      is_internal: false,
    },
  ])

  // Subcategories Monitoare
  await productModule.createProductCategories([
    {
      name: "Monitoare Second Hand",
      handle: "monitoare-second-hand",
      parent_category_id: monitoareCat.id,
      is_active: true,
      is_internal: false,
    },
    {
      name: "Monitoare Refurbished",
      handle: "monitoare-refurbished",
      parent_category_id: monitoareCat.id,
      is_active: true,
      is_internal: false,
    },
  ])

  // Subcategories Componente
  await productModule.createProductCategories([
    {
      name: "Componente Second Hand",
      handle: "componente-second-hand",
      parent_category_id: componenteCat.id,
      is_active: true,
      is_internal: false,
    },
    {
      name: "Componente Noi",
      handle: "componente-noi",
      parent_category_id: componenteCat.id,
      is_active: true,
      is_internal: false,
    },
  ])

  // Create Collections
  logger.info("Creating collections...")
  const [reduceriCollection, abiaIntrateCollection] =
    await productModule.createProductCollections([
      {
        title: "Reduceri Masive",
        handle: "reduceri-masive",
      },
      {
        title: "Abia Intrate",
        handle: "abia-intrate",
      },
    ])

  // Create demo products
  logger.info("Creating demo products...")

  const demoProducts = [
    // New products
    {
      title: "Laptop HP ProBook 450 G9 - Nou",
      handle: "hp-probook-450-g9-nou",
      description:
        "<p>Laptop HP ProBook 450 G9 nou, direct din stoc. Performanță business de top cu procesor Intel Core i5 de generatia 12.</p>",
      status: "published" as const,
      collection_id: abiaIntrateCollection.id,
      metadata: {
        condition: "new",
        condition_grade: null,
        warranty_months: 24,
        processor: "Intel Core i5-1235U",
        ram_gb: 16,
        storage_gb: 512,
        storage_type: "SSD",
        screen_size: 15.6,
        os: "Windows 11 Pro",
        sku_internal: "48101",
      },
      variants: [
        {
          title: "Default",
          sku: "HP-450-G9-NOU",
          prices: [{ amount: 379900, currency_code: "ron" }],
          inventory_quantity: 5,
          manage_inventory: true,
        },
      ],
      categories: [{ id: laptopuriCat.id }],
    },
    {
      title: "Laptop Dell Latitude 5520 - Nou",
      handle: "dell-latitude-5520-nou",
      description:
        "<p>Dell Latitude 5520 nou sigilat. Laptop business premium cu display FHD și baterie de lungă durată.</p>",
      status: "published" as const,
      metadata: {
        condition: "new",
        condition_grade: null,
        warranty_months: 24,
        processor: "Intel Core i7-1185G7",
        ram_gb: 16,
        storage_gb: 256,
        storage_type: "SSD",
        screen_size: 15.6,
        os: "Windows 11 Pro",
        sku_internal: "48102",
      },
      variants: [
        {
          title: "Default",
          sku: "DELL-LAT-5520-NOU",
          prices: [{ amount: 459900, currency_code: "ron" }],
          inventory_quantity: 3,
          manage_inventory: true,
        },
      ],
      categories: [{ id: laptopuriCat.id }],
    },
    {
      title: "PC Gaming Desktop Intel i9 - Nou",
      handle: "pc-gaming-intel-i9-nou",
      description:
        "<p>Calculator gaming de performanță cu procesor Intel Core i9 și placă video dedicată RTX 4070.</p>",
      status: "published" as const,
      collection_id: abiaIntrateCollection.id,
      metadata: {
        condition: "new",
        condition_grade: null,
        warranty_months: 24,
        processor: "Intel Core i9-13900K",
        ram_gb: 32,
        storage_gb: 1000,
        storage_type: "NVME",
        gpu: "RTX 4070 12GB",
        os: "Windows 11 Home",
        sku_internal: "48201",
      },
      variants: [
        {
          title: "Default",
          sku: "PC-GAMING-I9-NOU",
          prices: [{ amount: 799900, currency_code: "ron" }],
          inventory_quantity: 2,
          manage_inventory: true,
        },
      ],
      categories: [{ id: calculatoareCat.id }],
    },
    {
      title: "Monitor LG 27UL850 4K - Nou",
      handle: "monitor-lg-27ul850-4k-nou",
      description:
        "<p>Monitor LG 27 inch 4K UHD cu suport USB-C și HDR400. Ideal pentru profesioniști.</p>",
      status: "published" as const,
      metadata: {
        condition: "new",
        condition_grade: null,
        warranty_months: 24,
        screen_size: 27,
        sku_internal: "48301",
      },
      variants: [
        {
          title: "Default",
          sku: "LG-27UL850-NOU",
          prices: [{ amount: 249900, currency_code: "ron" }],
          inventory_quantity: 8,
          manage_inventory: true,
        },
      ],
      categories: [{ id: monitoareCat.id }],
    },
    // Refurbished products
    {
      title: "Laptop Lenovo ThinkPad T480 - Refurbished",
      handle: "lenovo-thinkpad-t480-refurbished",
      description:
        "<p>Lenovo ThinkPad T480 reconditionat la standard profesional. Testat, curatat și garantat 12 luni.</p>",
      status: "published" as const,
      collection_id: reduceriCollection.id,
      metadata: {
        condition: "refurbished",
        condition_grade: "A",
        warranty_months: 12,
        processor: "Intel Core i7-8650U",
        ram_gb: 16,
        storage_gb: 512,
        storage_type: "SSD",
        screen_size: 14,
        os: "Windows 11 Pro",
        sku_internal: "48103",
      },
      variants: [
        {
          title: "Default",
          sku: "LENOVO-T480-REFURB",
          prices: [{ amount: 189900, currency_code: "ron" }],
          inventory_quantity: 7,
          manage_inventory: true,
        },
      ],
      categories: [{ id: laptopuriCat.id }],
    },
    {
      title: "Laptop HP EliteBook 840 G6 - Refurbished",
      handle: "hp-elitebook-840-g6-refurbished",
      description:
        "<p>HP EliteBook 840 G6 refurbished grad A. Display FHD 14 inch anti-glare, baterie nouă.</p>",
      status: "published" as const,
      collection_id: reduceriCollection.id,
      metadata: {
        condition: "refurbished",
        condition_grade: "A",
        warranty_months: 12,
        processor: "Intel Core i5-8365U",
        ram_gb: 8,
        storage_gb: 256,
        storage_type: "SSD",
        screen_size: 14,
        os: "Windows 11 Pro",
        sku_internal: "48104",
      },
      variants: [
        {
          title: "Default",
          sku: "HP-840-G6-REFURB",
          prices: [{ amount: 149900, currency_code: "ron" }],
          inventory_quantity: 5,
          manage_inventory: true,
        },
      ],
      categories: [{ id: laptopuriCat.id }],
    },
    {
      title: "PC Dell OptiPlex 7060 - Refurbished",
      handle: "dell-optiplex-7060-refurbished",
      description:
        "<p>Calculator Dell OptiPlex 7060 refurbished. Perfect pentru birou și home office.</p>",
      status: "published" as const,
      collection_id: reduceriCollection.id,
      metadata: {
        condition: "refurbished",
        condition_grade: "A",
        warranty_months: 12,
        processor: "Intel Core i5-8500",
        ram_gb: 16,
        storage_gb: 256,
        storage_type: "SSD",
        os: "Windows 11 Pro",
        sku_internal: "48202",
      },
      variants: [
        {
          title: "Default",
          sku: "DELL-7060-REFURB",
          prices: [{ amount: 129900, currency_code: "ron" }],
          inventory_quantity: 10,
          manage_inventory: true,
        },
      ],
      categories: [{ id: calculatoareCat.id }],
    },
    {
      title: "Monitor Dell P2419H - Refurbished",
      handle: "monitor-dell-p2419h-refurbished",
      description:
        "<p>Monitor Dell 24 inch FHD refurbished grad B. Fara urme vizibile pe display, carcasa curata.</p>",
      status: "published" as const,
      collection_id: reduceriCollection.id,
      metadata: {
        condition: "refurbished",
        condition_grade: "B",
        warranty_months: 6,
        screen_size: 24,
        sku_internal: "48302",
      },
      variants: [
        {
          title: "Default",
          sku: "DELL-P2419H-REFURB",
          prices: [{ amount: 59900, currency_code: "ron" }],
          inventory_quantity: 12,
          manage_inventory: true,
        },
      ],
      categories: [{ id: monitoareCat.id }],
    },
    // Second-hand products
    {
      title: "Laptop Lenovo IdeaPad 320 - Second Hand",
      handle: "lenovo-ideapad-320-second-hand",
      description:
        "<p>Laptop Lenovo IdeaPad 320 second hand in stare buna. Urme minime de utilizare.</p>",
      status: "published" as const,
      metadata: {
        condition: "second-hand",
        condition_grade: "B",
        warranty_months: 3,
        processor: "Intel Core i3-6006U",
        ram_gb: 4,
        storage_gb: 500,
        storage_type: "HDD",
        screen_size: 15.6,
        os: "Windows 10 Home",
        sku_internal: "48105",
      },
      variants: [
        {
          title: "Default",
          sku: "LENOVO-320-SH",
          prices: [{ amount: 79900, currency_code: "ron" }],
          inventory_quantity: 3,
          manage_inventory: true,
        },
      ],
      categories: [{ id: laptopuriCat.id }],
    },
    {
      title: "Laptop Acer Aspire 5 - Second Hand",
      handle: "acer-aspire-5-second-hand",
      description:
        "<p>Acer Aspire 5 second hand. Display IPS Full HD, baterie cu autonomie buna.</p>",
      status: "published" as const,
      metadata: {
        condition: "second-hand",
        condition_grade: "B",
        warranty_months: 3,
        processor: "AMD Ryzen 5 5500U",
        ram_gb: 8,
        storage_gb: 256,
        storage_type: "SSD",
        screen_size: 15.6,
        os: "Windows 11 Home",
        sku_internal: "48106",
      },
      variants: [
        {
          title: "Default",
          sku: "ACER-ASPIRE5-SH",
          prices: [{ amount: 119900, currency_code: "ron" }],
          inventory_quantity: 4,
          manage_inventory: true,
        },
      ],
      categories: [{ id: laptopuriCat.id }],
    },
    {
      title: "PC HP Compaq 6300 Pro - Second Hand",
      handle: "hp-compaq-6300-pro-second-hand",
      description:
        "<p>Calculator HP Compaq 6300 Pro second hand. Ideal pentru sarcini de birou curente.</p>",
      status: "published" as const,
      metadata: {
        condition: "second-hand",
        condition_grade: "C",
        warranty_months: 0,
        processor: "Intel Core i3-3220",
        ram_gb: 4,
        storage_gb: 500,
        storage_type: "HDD",
        os: "Windows 10 Home",
        sku_internal: "48203",
      },
      variants: [
        {
          title: "Default",
          sku: "HP-6300-SH",
          prices: [{ amount: 39900, currency_code: "ron" }],
          inventory_quantity: 6,
          manage_inventory: true,
        },
      ],
      categories: [{ id: calculatoareCat.id }],
    },
    {
      title: "Monitor Samsung S24F350 - Second Hand",
      handle: "monitor-samsung-s24f350-second-hand",
      description:
        "<p>Monitor Samsung 24 inch second hand. Display FHD cu grad B de uzura.</p>",
      status: "published" as const,
      metadata: {
        condition: "second-hand",
        condition_grade: "B",
        warranty_months: 0,
        screen_size: 24,
        sku_internal: "48303",
      },
      variants: [
        {
          title: "Default",
          sku: "SAMSUNG-S24F350-SH",
          prices: [{ amount: 34900, currency_code: "ron" }],
          inventory_quantity: 8,
          manage_inventory: true,
        },
      ],
      categories: [{ id: monitoareCat.id }],
    },
  ]

  for (const product of demoProducts) {
    await productModule.createProducts([product as any])
    logger.info(`Created product: ${product.title}`)
  }

  logger.info("Seed completed successfully!")
}
