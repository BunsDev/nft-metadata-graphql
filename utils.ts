import { ethers } from "ethers";
import { getAddress, isAddress } from "ethers/lib/utils";
import * as ERC721ABI from './abis/ERC721.json';

const CHAIN_ID = 1;

export const jsonRpcProvider = new ethers.providers.StaticJsonRpcProvider({
  url: 'https://cloudflare-eth.com',
}, CHAIN_ID);

export const getERC721Contract = (address: string) => {
  return new ethers.Contract(address, ERC721ABI, jsonRpcProvider);
}

export const isERC721Contract = async (contract: ethers.Contract) => {
  try {
    // ERC721 interfaceID
    // bytes4 public constant INTERFACE_ID_ERC721 = 0x80ac58cd;
    // ERC1155 interfaceID
    // bytes4 public constant INTERFACE_ID_ERC1155 = 0xd9b67a26;

    const isSupported = await contract.supportsInterface('0x80ac58cd');
    return isSupported;
  } catch (e) {
    console.error('RPC error', e);
  }
  return false;
}

export const checksumAddress = (address: string) => {
  try {
    return getAddress(address.toLowerCase());
  } catch {}
  
  return address;
}
