import {
  storage,
  Context,
  PersistentMap,
} from "near-sdk-core";
import { AccountId } from "../../utils";

const STATE = "STATE";

@nearBindgen
class Vehicle {
  public vehicleServiceHistory: Array<VehicleService>
  constructor(
    public year:string,
    public make: string, 
    public model: string, 
    public owner: AccountId, 
    public dateAcquired: string, 
    ) {
      this.vehicleServiceHistory = []
    }
    @mutateState()
    addService(serviceDate: string, serviceNotes: string): void {
      let serviceToAdd = new VehicleService(serviceDate, serviceNotes);
      this.vehicleServiceHistory.push(serviceToAdd);
    }
}
@nearBindgen
class VehicleService {
  constructor(public serviceDate: string, public serviceNotes: string) {}
}
@nearBindgen
export class Contract {
  
  public vehicles: Array<Vehicle>;

  constructor(public contractName:string = 'Vehicle History') {
    this.vehicles = []
  }

  // read the given key from account (contract) storage
  read(key: string): string {
    if (isKeyInStorage(key)) {
      return `✅ Key [ ${key} ] has value [ ${storage.getString(key)!} ]`;
    } else {
      return `🚫 Key [ ${key} ] not found in storage. ( ${this.storageReport()} )`;
    }
  }

  
  @mutateState()
  write(key: string, value: string): string {
    storage.set(key, value);
    return `✅ Data saved. ( ${this.storageReport()} )`;
  }

  @mutateState()
  addOrUpdateVehicle(year:string, make: string,  model: string,  owner: AccountId, dateAcquired: string): void {
    const newVehicle = new Vehicle(year, make, model, owner, dateAcquired);
    this.vehicles.push(newVehicle)
    // add_or_update_vehicle(year, make, model, owner, dateAcquired);
  }

  @mutateState()
  clearVehicles(): void {
    this.vehicles = []
  }

  @mutateState()
  clearLastVehicles(): void {
    this.vehicles[0].vehicleServiceHistory.splice(0, 1)
  }

 
  @mutateState()
  clearLastVehicles2(): void {
    this.vehicles[0].vehicleServiceHistory = this.vehicles[0].vehicleServiceHistory.slice(0, 1)
  }

  @mutateState()
  clearChangeTwo(): void {
   this.vehicles[0].vehicleServiceHistory = this.vehicles[0].vehicleServiceHistory.map<VehicleService>(function (item, i) {
     if (i === 1) {
       item = new VehicleService("changed", "changed");
     }
     return item;
   })
  }


  @mutateState()
  addVehicleService(serviceDate: string, serviceNotes: string): void {
    this.vehicles[0].addService(serviceDate, serviceNotes)
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
  currentVehicles.push(newOrUpdatedVehicle);

  // set vehicles 
  currentContractState.vehicles = currentVehicles;

  // save contract with new values
  resave_contract(currentContractState);
}

export function add_vehicle_service(
  serviceDate: string, serviceNotes: string
): void {
  //  create a new VehicleService instance
  // const newVehicleService = new VehicleService(serviceDate, serviceNotes);

  // get contract STATE
  const currentContractState = get_contract_state();

  // get current vehicles
  const currentVehicles = currentContractState.vehicles;

  // add vehicle service to first vehicle
  // currentVehicles[0].vehicleServiceHistory.push(newVehicleService)
  currentVehicles[0].addService(serviceDate, serviceNotes)
  // currentVehicles.set(owner, newOrUpdatedVehicle);

  //  set vehicles property
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