import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { useKeyStore } from '../store/useKeyStore';
import { KeyType } from './interfaces/types';
import { ViemCryptoProvider } from './providers/ViemCryptoProvider';

interface IKeyManager {
  create(): Promise<void>
  sign(message: string): Promise<string>
  verify(message: string, signature: string): Promise<boolean>
  getPublicKey(): string
  getPrivateKey(): string
}

export class KeyManager implements IKeyManager {
  private cryptoProvider: ViemCryptoProvider
  private keyStore: typeof useKeyStore

  constructor() {
    this.cryptoProvider = new ViemCryptoProvider()
    this.keyStore = useKeyStore
  }

  async create(): Promise<void> {
    const keyPair = await this.cryptoProvider.generateKeyPair()
    const metadata = {
      id: uuidv4(),
      createdAt: Date.now(),
      keyType: KeyType.RSA,
    }
    this.keyStore.getState().saveKey(keyPair, metadata)
  }

  async sign(message: string): Promise<string> {
    const key = this.keyStore.getState().getKey()
    if (!key) throw new Error('No key available')
    
    return this.cryptoProvider.sign(message, key.keyPair.privateKey)
  }

  async verify(message: string, signature: string): Promise<boolean> {
    const key = this.keyStore.getState().getKey()
    if (!key) throw new Error('No key available')
    
    return this.cryptoProvider.verify(
      message,
      signature,
      key.keyPair.publicKey,
    );
  }

  getPublicKey(): string {
    const key = this.keyStore.getState().getKey()
    if (!key) throw new Error('No key available')
    return key.keyPair.publicKey
  }

  getPrivateKey(): string {
    const key = this.keyStore.getState().getKey()
    if (!key) throw new Error('No key available')
    return key.keyPair.privateKey
  }
}