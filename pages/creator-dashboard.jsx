import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import NFTMarketplace from '@/abi/NFTMarketplace.json'
import { contractAddress } from '@/config'
import Image from 'next/image'
import Spinner from '@/components/Spinner'
export default function ListedNFTs() {
  const [myNfts, setMyNfts] = useState([])
  const [loading, setLoading] = useState('not-loaded')
  useEffect(() => {
    fetchMyNfts()
  }, [])
  async function fetchMyNfts() {
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
      const myNfts = await nftMarketContract.fetchItemsListed()
      const items = await Promise.all(
        myNfts.map(async (nft) => {
          const tokenURI = await nftMarketContract.tokenURI(nft.tokenId)
          const meta = await axios.get(tokenURI)
          const price = ethers.formatUnits(nft.price.toString(), 'ether')
          let item = {
            price,
            tokenId: nft.tokenId.toString(),
            seller: nft.seller,
            owner: nft.owner,
            image: meta.data.image,
            description: meta.data.description,
            name: meta.data.name,
          }

          return item
        })
      )
      setMyNfts(items)
      setLoading('loaded')
    } catch (error) {
      console.log(error)
    }
  }

  async function cancelNFTListing(tokenID) {
    try {
      setLoading('not-loaded')
      const web3Modal = new Web3Modal()
      const connection = await web3Modal.connect()
      const provider = new ethers.BrowserProvider(connection)
      const signer = await provider.getSigner()
      const nftMarketContract = new ethers.Contract(
        contractAddress,
        NFTMarketplace.abi,
        signer
      )

      const transaction = await nftMarketContract.cancelItemListing(tokenID)
      await transaction.wait()
      fetchMyNfts()
    } catch (error) {
      console.log(error)
    }
  }

  if (loading === 'not-loaded') {
    return <Spinner />
  }
  if (loading === 'loaded' && !myNfts.length) {
    return (
      <div className='container mx-auto px-4 mt-10 pt-16'>
        <h1 className='text-3xl font-semibold mb-8 ml-5'>
          No NFTs Listed By you
        </h1>
      </div>
    )
  }
  return (
    <div className='container mx-auto px-4 mt-10 pt-16'>
      <h1 className='text-3xl font-semibold mb-8 ml-5'>
        Dashboard - My Listed NFTs
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
        {myNfts.map((nft) => (
          <div key={nft.name} className='border p-4 rounded-lg'>
            <Image
              src={nft.image}
              alt={nft.name}
              width={300}
              height={200}
              className='w-full h-96 object-cover mb-4 rounded'
            />
            <h2 className='text-xl mb-2'>{nft.name}</h2>
            <p className='text-gray-700 mb-4'>{nft.description}</p>
            <div className='flex justify-between items-center'>
              <span className='font-semibold text-xl'>{nft.price} ETH</span>
              <button
                className='bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600'
                onClick={() => cancelNFTListing(nft.tokenId)}
              >
                Cancel Listing
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
