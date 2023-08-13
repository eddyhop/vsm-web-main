import { setupWorker } from 'msw'
import mockservice from './mockservice'

export const worker = setupWorker(...mockservice)