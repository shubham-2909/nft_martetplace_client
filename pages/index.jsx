import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import NFTMarketplace from '@/abi/NFTMarketplace.json'
import { contractAddress, INFURA_URL } from '@/config'
import NFTCard from '@/components/NFTCard'
import Spinner from '@/components/Spinner'
export default function Home() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    try {
      const provider = new ethers.JsonRpcProvider(INFURA_URL)
      const nftMarketContract = new ethers.Contract(
        contractAddress,
        NFTMarketplace.abi,
        provider
      )
      const data = await nftMarketContract.fetchMarketItems()
      const items = await Promise.all(
        data.map(async (i) => {
          const tokenURI = await nftMarketContract.tokenURI(i.tokenId)
          const meta = await axios.get(tokenURI)
          let price = ethers.formatUnits(i.price.toString(), 'ether')
          let item = {
            price,
            tokenId: i.tokenId.toString(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            description: meta.data.description,
            name: meta.data.name,
          }

          return item
        })
      )

      console.log(items)

      setNfts(items)
      setLoadingState('loaded')
    } catch (error) {
      console.log(error)
    }
  }
  async function buyNFT(nft) {
    setLoadingState('not-loaded')
    try {
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.BrowserProvider(connection)
      const network = await provider.getNetwork()
      if (network.chainId.toString() !== '11155111') {
        alert('Please connect to sepolia test network')
        return
      }

      const signer = await provider.getSigner()
      const nftMarketContract = new ethers.Contract(
        contractAddress,
        NFTMarketplace.abi,
        signer
      )
      const price = ethers.parseUnits(nft.price.toString(), 'ether')

      const transaction = await nftMarketContract.createMarketSale(
        nft.tokenId,
        { value: price }
      )
      await transaction.wait()
      loadNFTs()
    } catch (error) {
      console.log(error.message)
    }
  }
  if (loadingState === 'not-loaded') {
    return <Spinner />
  }
  if (loadingState === 'loaded' && !nfts.length) {
    return <h1 className='px-20 py-10 text-3xl'>No NFTs to buy currently...</h1>
  }
  return (
    <div className='container mx-auto px-4 mt-10 pt-16'>
      <h1 className='text-3xl font-semibold ml-8 mb-8'>Available NFTs</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
        {nfts.map((nft) => (
          <NFTCard key={nft.tokenId} nft={nft} buyNFT={buyNFT} />
        ))}
      </div>
    </div>
  )
}
