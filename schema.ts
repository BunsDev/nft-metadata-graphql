import { gql, UserInputError } from "apollo-server-express";
import { isAddress } from "ethers/lib/utils";
import { parseTokenURI } from "./metadata";
import { getERC721Contract, isERC721Contract } from "./utils";

export const typeDefs = gql`
  type NftMetadata {
    name: String!
    description: String!
    image: Image
    attributes: [Attribute!]!
  }

  type Image {
    format: String!
    width: Int!
    height: Int!
    originalUrl: String!
  }

  type Attribute {
    traitType: String!
    value: String!
    displayType: String
  }

  input NftMetadataInput {
    collection: String!
    tokenId: String!
  }

  type Query {
    nftMetadata(input: NftMetadataInput!): NftMetadata
  }
`;

export const resolvers = {
  Query: {
    nftMetadata: async (_parent, args, _context) => {
      const { collection, tokenId } = args.input;

      if (!isAddress(collection)) {
        throw new UserInputError("Invalid contract address");
      }

      if (isNaN(Number(tokenId))) {
        throw new UserInputError("Invalid tokenId");
      }

      const contract = getERC721Contract(collection);

      if (!await isERC721Contract(contract)) {
        throw new UserInputError("Not ERC721 contract");
      }

      const url = await contract.tokenURI(tokenId);

      const metadata = await parseTokenURI(url);

      // Parse metadata URL
      // Consider; web URL (https://), IPFS-based URL(ipfs://) etc.
      // Image can be; web URL (https://), or base64 encoded string
      // Some low-quality projects are using incorrectly (against EIP) formatted metadata.
      // Reference: https://github.com/spectrexyz/use-nft/blob/main/src/utils.tsx

      return {
        name: `#${tokenId}`,
        description: '',
        ...metadata,
      }
    },
  }
};
