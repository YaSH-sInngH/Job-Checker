// scripts/clear-chromadb-jobs.ts
import { ChromaClient } from 'chromadb';

async function clearChromaJobsCollection() {
  const chroma = new ChromaClient();
  const identityEmbeddingFunction = {
    generate: async (_texts: string[]) => {
      throw new Error('Should not be called, as you provide embeddings directly.');
    },
    name: 'identity',
  };
  const collection = await chroma.getOrCreateCollection({
    name: 'jobs',
    embeddingFunction: identityEmbeddingFunction,
  });
  await collection.delete({}); // This deletes all vectors in the collection
  console.log('ChromaDB jobs collection cleared.');
}

clearChromaJobsCollection();
