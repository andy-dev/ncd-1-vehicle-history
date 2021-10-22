import {
  storage,
  Context,
  PersistentMap,
} from "near-sdk-core";
import { AccountId } from "../../utils";

const STATE = "STATE";

@nearBindgen
class Vehicle {
  constructor(
    public year:string,
    public make: string, 
    public model: string, 
    public owner: AccountId, 
    public dateAcquired: string, 
    ) {}
}
@nearBindgen
class VehicleService {
  constructor(public serviceDate: string, public serviceNotes: string) {}
}
@nearBindgen
export class Contract {
  public vehicleServiceHistory: Array<VehicleService>;
  public vehicles: PersistentMap<AccountId, Vehicle>;

  constructor(public contractName:string = 'Vehicle History') {
    this.vehicleServiceHistory = [],
    this.vehicles = new PersistentMap<AccountId, Vehicle>("vo")
  }

  // read the given key from account (contract) storage
  read(key: string): string {
    if (isKeyInStorage(key)) {
      return `✅ Key [ ${key} ] has value [ ${storage.getString(key)!} ]`;
    } else {
      return `🚫 Key [ ${key} ] not found in storage. ( ${this.storageReport()} )`;
    }
  }

  
  getAllVehicleServiceHistory(): Array<VehicleService> {
    // get contract STATE
    const currentContractState = get_contract_state();
    
    // get current vehicle history
    const currentVehicleServiceHistory = currentContractState.vehicleServiceHistory;

    return currentVehicleServiceHistory;
  }

  @mutateState()
  write(key: string, value: string): string {
    storage.set(key, value);
    return `✅ Data saved. ( ${this.storageReport()} )`;
  }

  @mutateState()
  addOrUpdateVehicle(year:string, make: string,  model: string,  owner: AccountId, dateAcquired: string): void {
    add_or_update_vehicle(year, make, model, owner, dateAcquired);
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

export function add_or_update_vehicle(
  year: string,
  make: string,
  model: string,
  owner: AccountId,
  dateAcquired: string
): void {
  // create a new VehicleOwner instance
  const newOrUpdatedVehicle = new Vehicle(year, make, model, owner, dateAcquired);

  // get contract STATE
  const currentContractState = get_contract_state();

  // get current vehicles
  const currentVehicles = currentContractState.vehicles;

  // set or update key val pairs
  currentVehicles.set(owner, newOrUpdatedVehicle);

  // set vehicles property
  currentContractState.vehicles = currentVehicles;

  // save contract with new values
  resave_contract(currentContractState);
}


export function get_contract_state(): Contract {
  return storage.getSome<Contract>(STATE);
}

export function resave_contract(contract: Contract): void {
  storage.set(STATE, contract);
}