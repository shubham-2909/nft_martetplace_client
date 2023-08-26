// components/NFTCard.js\
import Image from 'next/image'
function NFTCard({ nft, buyNFT }) {
  return (
    <div className='border p-4 rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300'>
      <div className='h-96 w-full relative overflow-hidden rounded-md mb-4'>
        <Image
          src={nft.image}
          alt={nft.name}
          width={400}
          height={400}
          className='absolute top-0 left-0 w-[80vw] h-full object-cover object-center'
        />
      </div>

      <h2 className='text-xl font-semibold mb-2'>{nft.name}</h2>
      <p className='text-gray-600 mb-4'>{nft.description}</p>
      {/* <button
        className='bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-700 focus:outline-none focus:bg-pink-700 transition-colors duration-300'
        onClick={() => buyNFT(nft)}
      >
        Buy Now
      </button> */}
      <div className='flex justify-between items-center'>
        <span className='font-semibold text-xl'>{nft.price} ETH</span>
        <button
          className='bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600'
          onClick={() => buyNFT(nft)}
        >
          Buy Now
        </button>
      </div>
    </div>
  )
}

export default NFTCard
