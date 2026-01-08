import * as fs from 'fs'
import prependNetworkPath from './prependNetworkPath.mjs'
import removeNetworkFromName from './removeNetworkFromName.mjs'

/** @type {import('@orval/core').Config} */
const config = {
  nexus: {
    input: {
      target: './v1-sapphire-only.yaml',
      // Original full spec (kept for reference):
      // target: 'https://raw.githubusercontent.com/oasisprotocol/nexus/main/api/spec/v1.yaml',
      override: {
        // We want:
        // - network as a parameter for controlling API baseURL
        // - network in queryKey
        // We don't want:
        // - network parameter to be sent to API
        // - network in operation names
        transformer: prependNetworkPath,
      },
    },
    output: {
      target: './generated/api.ts',
      client: 'react-query',
      mode: 'single',
      urlEncodeParameters: true,
      override: {
        operationName: removeNetworkFromName,
        mutator: './replaceNetworkWithBaseURL.ts',
      },
    },
    hooks: {
      afterAllFilesWrite: async filesPaths => {
        for (const filePath of filesPaths) {
          const generatedApiFile = await fs.promises.readFile(filePath, 'utf-8')

          const patchedApiFile = generatedApiFile.replaceAll(
            '{ [key: string]: unknown };',
            '{ [key: string]: any }; /* modified by afterAllFilesWrite */',
          )

          await fs.promises.writeFile(filePath, patchedApiFile, 'utf-8')
        }
      },
    },
  },
}

export default config
