import { useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import Image from 'next/image'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { contractAddress, PINATA_KEY, PINATA_SECRET } from '@/config'
import NFTMarketplace from '@/abi/NFTMarketplace.json'

export default function CreateNFT() {
  const [fileurl, setFileurl] = useState(null)
  const [formInput, setFormInput] = useState({
    price: '',
    name: '',
    description: '',
  })
  const [loadingState, setLoadingState] = useState('not-loaded')
  const router = useRouter()

  // function to upload image to Pinata IPFS
  async function uploadImage(e) {
    const file = e.target.files[0]
    try {
      const formData = new FormData()
      formData.append('file', file)
      const resfile = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': `multipart/form-data`,
            pinata_api_key: PINATA_KEY,
            pinata_secret_api_key: PINATA_SECRET,
          },
        }
      )

      const imageURL = `https://gateway.pinata.cloud/ipfs/${resfile.data.IpfsHash}`
      setFileurl(imageURL)
    } catch (error) {
      console.log(error)
    }
  }

  //function to upload metadata
  async function uploadMetaData() {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileurl) return
    setLoadingState('loading')
    try {
      const data = JSON.stringify({
        pinataMetadata: { name: `${name}.json` },
        pinataContent: { name, description, image: fileurl },
      })

      const resfile = await axios.post(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        data,
        {
          headers: {
            'Content-Type': `application/json`,
            pinata_api_key: PINATA_KEY,
            pinata_secret_api_key: PINATA_SECRET,
          },
        }
      )

      const tokenURI = `https://gateway.pinata.cloud/ipfs/${resfile.data.IpfsHash}`
      return tokenURI
    } catch (error) {
      console.log(error)
    }
  }

  async function listNFTforSale() {
    try {
      const url = await uploadMetaData()
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
      const price = ethers.parseUnits(formInput.price, 'ether')
      let listingPrice = await nftMarketContract.getListingPrice()
      listingPrice = listingPrice.toString()
      let transaction = await nftMarketContract.createToken(url, price, {
        value: listingPrice,
      })
      await transaction.wait()
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className='container mx-auto px-4 mt-10 pt-16'>
      <h1 className='text-3xl font-semibold mb-8 ml-5'>Create New NFT</h1>
      <div className='bg-white mb-6 rounded p-8 shadow-sm hover:shadow-md'>
        <label className='block mb-2 text-sm font-medium text-gray-600'>
          Name
        </label>
        <input
          type='text'
          value={formInput.name}
          onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
          className='w-full px-3 py-2 border rounded-md'
          placeholder='Enter NFT name'
        />

        <div className='mb-6'>
          <label className='block mb-2 text-sm font-medium text-gray-600'>
            Description
          </label>
          <textarea
            name='description'
            rows='3'
            className='w-full px-3 py-2 border rounded-md'
            placeholder='Enter NFT description'
            value={formInput.description}
            onChange={(e) =>
              setFormInput({ ...formInput, description: e.target.value })
            }
            spellCheck='false'
          />
        </div>
        <div className='mb-6'>
          <label className='block mb-2 text-sm font-medium text-gray-600'>
            Price (ETH)
          </label>
          <input
            type='text'
            className='w-full px-3 py-2 border rounded-md'
            placeholder='Enter price in ETH'
            value={formInput.price}
            onChange={(e) =>
              setFormInput({ ...formInput, price: e.target.value })
            }
          />
        </div>
        <div className='mb-6'>
          <label className='block mb-2 text-sm font-medium text-gray-600'>
            Upload Image
          </label>
          <input type='file' onChange={uploadImage} className='text-gray-600' />
        </div>
        <button
          className={`bg-pink-500 text-white px-6 py-2 rounded hover:bg-pink-600 ${
            fileurl ? 'block' : 'hidden'
          }`}
          disabled={!fileurl}
          onClick={listNFTforSale}
        >
          Create
        </button>
      </div>
    </div>
  )
}
