import {
  storage,
  Context,
  PersistentMap,
} from "near-sdk-core";
import { AccountId, idCreator } from "../../utils";
const STATE = "STATE";

@nearBindgen
class Vehicle {
  public id: string
  public vehicleServiceHistory: Array<VehicleService>
  constructor(
    public year:string,
    public make: string, 
    public model: string, 
    public owner: AccountId, 
    public dateAcquired: string, 
    public vehicleNotes: string
    ) {
      this.id = idCreator()
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
  public id: string
  constructor(public serviceDate: string, public serviceNotes: string) {
    this.id = idCreator()
  }
}
@nearBindgen
export class Contract {
  public vehicles: Array<Vehicle>;
  constructor(public contractName:string = 'Vehicle History') {
    this.vehicles = []
  }
  @mutateState()
  addVehicle(year:string, make: string,  model: string,  owner: AccountId, dateAcquired: string, vehicleNotes: string): void {
    const newVehicle = new Vehicle(year, make, model, owner, dateAcquired, vehicleNotes);
    this.vehicles.push(newVehicle)
  }

  @mutateState()
  addVehicleService(vehicleId:string, serviceDate: string, serviceNotes: string): void {
    // find vehicle call method on the vehicle we want to add service too
    // you can't update a service, if an error was made a new service has to be entered with notes
    for (let i = 0; i < this.vehicles.length; ++i) {
      if(this.vehicles[i].id === vehicleId){
        this.vehicles[i].addService(serviceNotes, serviceDate)
      }
    
    // NOTE LIMITATIONS:
    // this does not work, closures not supported on AS 
    // this.vehicles = this.vehicles.map<Vehicle>(function(vehicle){
    //   if(vehicle.id == vehicleId){
    //     vehicle.addService(serviceDate, serviceNotes)
    //   }
    //   return vehicle
    // })
    }
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


export function get_contract_state(): Contract {
  return storage.getSome<Contract>(STATE);
}

export function resave_contract(contract: Contract): void {
  storage.set(STATE, contract);
}