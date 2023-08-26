import '@/styles/globals.css'
import Head from 'next/head'
import NavBar from '@/components/NavBar'
export default function App({ Component, pageProps }) {
  return (
    <div>
      <Head>
        <title>NFT Marketplace</title>
        <meta
          name='description'
          content='Buy and sell your favorite NFTs on our platform!'
        />
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <NavBar />
      <Component {...pageProps} />
    </div>
  )
}
