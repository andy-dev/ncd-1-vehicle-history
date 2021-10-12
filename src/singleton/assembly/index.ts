import { storage, Context, PersistentMap } from "near-sdk-core";
import { AccountId } from "../../utils";

const STATE = "STATE";
@nearBindgen
class VehicleOwner {
  constructor(public vehicleOwner: AccountId, public dateAcquired: string) {}
}
@nearBindgen
class VehicleService {
  constructor(public serviceDate: string, public serviceNotes: string) {}
}
@nearBindgen
export class Contract {
  public vehicle: string = "Mini";
  public vehicleServiceHistory: Array<VehicleService> = [];

  constructor(
    public vehicleOwners: PersistentMap<
      AccountId,
      VehicleOwner
    > = new PersistentMap<AccountId, VehicleOwner>("vo")
  ) {}

  // read the given key from account (contract) storage
  read(key: string): string {
    if (isKeyInStorage(key)) {
      return `✅ Key [ ${key} ] has value [ ${storage.getString(key)!} ]`;
    } else {
      return `🚫 Key [ ${key} ] not found in storage. ( ${this.storageReport()} )`;
    }
  }

  // todo figure out how to read this properties
  // getAllVehicleOwners(): string {
  //   // get contract STATE
  //   const currentContractState = get_contract_state();
  //   // get current vehicle owners
  //   const currentVehicleOwners = currentContractState.vehicleOwners;

  //   return `Vehicle Owners: ${currentVehicleOwners}`;
  // }

  // getAllVehicleServiceHistory(): string {
  //   // this does not
  //   // // get contract STATE
  //   // const currentContractState = get_contract_state();
  //   // // get current vehicle history
  //   // const currentVehicleServiceHistory =
  //   //   currentContractState.vehicleServiceHistory;

  //   // return `Vehicle Service History: ${currentVehicleServiceHistory}`;
  // }

  @mutateState()
  write(key: string, value: string): string {
    storage.set(key, value);
    return `✅ Data saved. ( ${this.storageReport()} )`;
  }

  @mutateState()
  addOrUpdateVehicleOwner(vehicleOwner: AccountId, dateAcquired: string): void {
    add_or_update_vehicle_owner(vehicleOwner, dateAcquired);
  }

  @mutateState()
  addService(serviceDate: string, serviceNotes: string): void {
    let serviceToAdd = new VehicleService(serviceDate, serviceNotes);
    this.vehicleServiceHistory.push(serviceToAdd);
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

export function add_or_update_vehicle_owner(
  vehicleOwner: AccountId,
  dateAcquired: string
): void {
  // create a new VehicleOwner instance
  const newOrUpdatedVehicleOwner = new VehicleOwner(vehicleOwner, dateAcquired);

  // get contract STATE
  const currentContractState = get_contract_state();

  // get current vehicle owners
  const currentVehicleOwners = currentContractState.vehicleOwners;

  // set or update key val pairs
  currentVehicleOwners.set(vehicleOwner, newOrUpdatedVehicleOwner);

  // set vehicleOwners property
  currentContractState.vehicleOwners = currentVehicleOwners;

  // save contract with new values
  resave_contract(currentContractState);
}

export function get_contract_state(): Contract {
  return storage.getSome<Contract>(STATE);
}

export function resave_contract(contract: Contract): void {
  storage.set(STATE, contract);
}
