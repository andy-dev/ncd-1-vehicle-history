import {
  storage,
  Context,
  PersistentMap,
  PersistentUnorderedMap,
  MapEntry,
} from "near-sdk-core";
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
  public vehicle: string;

  public vehicleServiceHistory: Array<VehicleService>;
  public vehicleOwners: PersistentMap<AccountId, VehicleOwner>;
  public vehicleOwnersPmap: PersistentUnorderedMap<AccountId, VehicleOwner>;

  constructor(public year:string = '2013') {
    this.vehicle = "Mini", 
    this.vehicleServiceHistory = [],
    this.vehicleOwners = new PersistentMap<AccountId, VehicleOwner>("vo"),
    this.vehicleOwnersPmap = new PersistentUnorderedMap<AccountId,VehicleOwner>("pma")
  }

  // read the given key from account (contract) storage
  read(key: string): string {
    if (isKeyInStorage(key)) {
      return `✅ Key [ ${key} ] has value [ ${storage.getString(key)!} ]`;
    } else {
      return `🚫 Key [ ${key} ] not found in storage. ( ${this.storageReport()} )`;
    }
  }

  getAllVehicleOwners(): PersistentMap<AccountId, VehicleOwner> {
    // get contract STATE
    const currentContractState = get_contract_state();
    // get current vehicle owners
    const currentVehicleOwners = currentContractState.vehicleOwners;

    return currentVehicleOwners;
  }

  getAllVehicleOwnersPMap(): MapEntry<string, VehicleOwner>[] {
    // get contract STATE
    const currentContractState = get_contract_state();
    // get current vehicle owners
    const currentVehicleOwners = currentContractState.vehicleOwnersPmap.entries(
      0,
      currentContractState.vehicleOwnersPmap.length
    );

    return currentVehicleOwners;
  }

  getAllVehicleServiceHistory(): Array<VehicleService> {
    // this does not
    // get contract STATE
    const currentContractState = get_contract_state();
    // get current vehicle history
    const currentVehicleServiceHistory =
      currentContractState.vehicleServiceHistory;

    return currentVehicleServiceHistory;
  }

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
  addOrUpdateVehicleOwnerPMap(
    vehicleOwner: AccountId,
    dateAcquired: string
  ): void {
    add_or_update_vehicle_owner_pmap(vehicleOwner, dateAcquired);
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

export function add_or_update_vehicle_owner_pmap(
  vehicleOwner: AccountId,
  dateAcquired: string
): void {
  // create a new VehicleOwner instance
  const newOrUpdatedVehicleOwner = new VehicleOwner(vehicleOwner, dateAcquired);

  // get contract STATE
  const currentContractState = get_contract_state();

  // get current vehicle owners
  const currentVehicleOwners = currentContractState.vehicleOwnersPmap;

  // set or update key val pairs
  currentVehicleOwners.set(vehicleOwner, newOrUpdatedVehicleOwner);

  // set vehicleOwners property
  currentContractState.vehicleOwnersPmap = currentVehicleOwners;

  // save contract with new values
  resave_contract(currentContractState);
}

export function get_contract_state(): Contract {
  return storage.getSome<Contract>(STATE);
}

export function resave_contract(contract: Contract): void {
  storage.set(STATE, contract);
}
