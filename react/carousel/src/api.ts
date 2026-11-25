

export interface Images {
    id: number;
    author: string;
    width: number;
    height: number;
    url: string;
    download_url: string;
}

export const getImages = async (signal?: AbortSignal): Promise<Images[]> => {
  const response = await fetch('https://picsum.photos/v2/list?page=2&limit=100', { signal });
  if (!response.ok) {
    throw new Error(`Failed to load images (${response.status}).`);
  }
  return await response.json() as Images[];
};
