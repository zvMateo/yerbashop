import { Metadata } from 'next'

export function generateProductMetadata(product: {
  name: string
  description?: string
  images?: string[]
  pricesPerKg?: Record<string, number>
  seoTitle?: string
  seoDescription?: string
}): Metadata {
  const title = product.seoTitle || `${product.name} - YerbaShop`
  const description = product.seoDescription || product.description || `Descubre ${product.name} en YerbaShop. Yerba mate agroecológica de la mejor calidad.`
  
  // Obtener el precio más bajo
  const prices = Object.values(product.pricesPerKg || {})
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'product',
      images: product.images && product.images.length > 0 ? [
        {
          url: product.images[0],
          width: 800,
          height: 600,
          alt: product.name,
        }
      ] : [],
      siteName: 'YerbaShop',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.images && product.images.length > 0 ? [product.images[0]] : [],
    },
    other: {
      'product:price:amount': lowestPrice.toString(),
      'product:price:currency': 'ARS',
    },
  }
}

export function generatePageMetadata({
  title,
  description,
  keywords,
}: {
  title: string
  description: string
  keywords?: string[]
}): Metadata {
  return {
    title,
    description,
    keywords: keywords?.join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'YerbaShop',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}
