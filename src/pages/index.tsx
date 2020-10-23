import SEO from '@/components/SEO';
import Link from 'next/link';
import { client } from '@/lib/prismic';
import { GetServerSideProps } from 'next';
import { Title } from '../styles/pages/Home';
import Prismic from 'prismic-javascript';
import PrismicDOM from 'prismic-dom';
import { Document } from 'prismic-javascript/types/documents';

interface HomeProps {
  categories: Document[];
  recommendedProducts: Document[];
}

export default function Home({ categories, recommendedProducts }: HomeProps) {
  return (
    <div>
      <SEO 
        title="DevCommerce your best place for devs" 
        shouldExcludeTitleSuffix 
        image="boost.png"
      />

      <section>
        <Title>Categories</Title>

        <ul>
          {categories.map(category => (
            <li key={category.id}>
              <Link href={`/catalog/categories/${category.uid}`}>
                <a>
                  {PrismicDOM.RichText.asText(category.data.title)}
                </a>
              </Link> 
            </li>
          ))}
        </ul>
        <Title>Products</Title>

        <ul>
          {recommendedProducts.map(product => (
            <li key={product.id}>
              <Link href={`/catalog/products/${product.uid}`}>
                <a>
                  {PrismicDOM.RichText.asText(product.data.title)}
                </a>
              </Link> 
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at('document.type', 'product')
  ])

  const categories = await client().query([
    Prismic.Predicates.at('document.type', 'category'),
  ]);

  return {
    props: {
      categories: categories.results,
      recommendedProducts: recommendedProducts.results,
    }
  }
}