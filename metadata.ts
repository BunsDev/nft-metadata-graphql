import axios from "axios";
import * as sharp from "sharp";

const parseIpfsUrl = (url: string) => {
  if (url && url.startsWith("ipfs://")) {
    // ipfs://QmVjQ392929/image.png
    const ipfsUrl = url.replace("ipfs://", "");
    const ipfsHash = ipfsUrl.split("/")[0];
    const ipfsPath = ipfsUrl.split("/").slice(1).join("/");
    return {
      ipfsHash,
      ipfsPath,
    };
  }

  return null;
};

const fetchTokenMetadata = (url: string) => {
  return axios.get(url).then((resp) => resp.data);
};

export const parseTokenURI = async (uri: string) => {
  const ipfsUrlInfo = parseIpfsUrl(uri);
  let metadata: Record<string, any> = {};
  let parsedMetadata: Record<string, any> = {};

  if (ipfsUrlInfo) {
    const { ipfsHash, ipfsPath } = ipfsUrlInfo;
    const ipfsUrl = `https://ipfs.io/ipfs/${ipfsHash}/${ipfsPath}`;

    metadata = await fetchTokenMetadata(ipfsUrl);
  } else if (uri.startsWith("http://") || uri.startsWith("https://")) {
    metadata = await fetchTokenMetadata(uri);
  } else {
    throw new Error("Unsupported token URI");
  }

  for (const key in metadata) {
    if (metadata.hasOwnProperty(key)) {
      const value = metadata[key];
      parsedMetadata[key] = value;

      if (key === "attributes") {
        parsedMetadata[key] = value.map((attribute) => ({
          traitType: attribute.trait_type,
          value: attribute.value,
          displayType: attribute.display_type,
        }));
      }

      if (key === "image") {
        // Parse image mime type

        const info = parseIpfsUrl(value);
        let url = value;
        if (info) {
          url = `https://ipfs.io/ipfs/${info.ipfsHash}/${info.ipfsPath}`;
        }

        try {
          const imageData = await axios
          .get(url, {
            responseType: "arraybuffer",
          })
          .then((resp) => {
            return resp.data
          });

          const imageMetadata = await sharp(imageData)
            .metadata();

          parsedMetadata[key] = {
            format: imageMetadata.format,
            width: imageMetadata.width,
            height: imageMetadata.height,
            originalUrl: value,
          }
        } catch (error) {
          console.error('Parse image metadata error', error);
        }
        
      }
    }
  }

  return parsedMetadata;
};
