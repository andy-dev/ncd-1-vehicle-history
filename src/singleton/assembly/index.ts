import { storage, Context, PersistentMap } from "near-sdk-core";
import { XCC_GAS, AccountId, asNEAR } from "../../utils";
@nearBindgen
class VehicleOwner {
  constructor(public vehicleOwner: AccountId, public dateAcquired: string) {}
}
class VehicleService {
  constructor(
    public vehicleOwner: AccountId,
    public dateService: string,
    public serviceNotes: string
  ) {}
}

const STATE = "STATE";

@nearBindgen
export class Contract {
  constructor(
    public playersScores: PersistentMap<
      AccountId,
      PlayerGuess
    > = new PersistentMap<AccountId, PlayerGuess>("playerguess")
  ) {}

  // read the given key from account (contract) storage
  read(key: string): string {
    if (isKeyInStorage(key)) {
      return `✅ Key [ ${key} ] has value [ ${storage.getString(key)!} ]`;
    } else {
      return `🚫 Key [ ${key} ] not found in storage. ( ${this.storageReport()} )`;
    }
  }

  // write the given value at the given key to account (contract) storage
  @mutateState()
  write(key: string, value: string): string {
    storage.set(key, value);
    return `✅ Data saved. ( ${this.storageReport()} )`;
  }

  // private helper method used by read() and write() above
  private storageReport(): string {
    return `storage [ ${Context.storageUsage} bytes ]`;
  }
}

/**
 * This function exists only to avoid a compiler error
 *
 * @param key string key in account storage
 * @returns boolean indicating whether key exists
 */
function isKeyInStorage(key: string): bool {
  return storage.hasKey(key);
}
