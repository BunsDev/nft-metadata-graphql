# nft-metadata-graphql
GraphQL server with NFT metadata query.

It will return parse and return the metadata of any token from ERC721 contract. For image URL, it will parse the image metadata, and return its format, width, and height informations.

This is built using `Apollo graphql Server` and `ethers.js`.

# How to run

```bash
yarn
yarn dev
```

# Example

## Query

```
query queryMAYCMetadata($input: NftMetadataInput!) {
  nftMetadata(input: $input) {
    __typename
    name
    image {
      format
      width
      height
      originalUrl
    }
    description
    attributes {
      traitType
      value
      displayType
    }
  }
}
```

```
{
  "input": {
    "collection": "0x60E4d786628Fea6478F785A6d7e704777c86a7c6",
    "tokenId": "20"
  }
}
```

## Response

```json
{
  "data": {
    "nftMetadata": {
      "__typename": "NftMetadata",
      "name": "#20",
      "image": {
        "format": "png",
        "width": 1262,
        "height": 1262,
        "originalUrl": "ipfs://QmYEHLvbKK8WQn151A4VkDxULPvFE6UQB16Jtp5yysmZq2"
      },
      "description": "",
      "attributes": [
        {
          "traitType": "Background",
          "value": "M1 Orange",
          "displayType": null
        },
        {
          "traitType": "Fur",
          "value": "M1 Blue",
          "displayType": null
        },
        {
          "traitType": "Eyes",
          "value": "M1 3d",
          "displayType": null
        },
        {
          "traitType": "Clothes",
          "value": "M1 Tanktop",
          "displayType": null
        },
        {
          "traitType": "Hat",
          "value": "M1 Seaman's Hat",
          "displayType": null
        },
        {
          "traitType": "Mouth",
          "value": "M1 Bored Cigar",
          "displayType": null
        }
      ]
    }
  }
}
```
