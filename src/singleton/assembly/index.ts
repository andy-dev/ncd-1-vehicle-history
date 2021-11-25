// import {
//   storage,
//   Context,
//   logging,
//   PersistentMap,
//   PersistentVector
// } from "near-sdk-core";
// import { AccountId, idCreator } from "../../utils";
// const STATE = "STATE";

// @nearBindgen
// class Vehicle {
//   public id: string
//   public vehicleServiceHistory: PersistentVector<VehicleService>
//   constructor(
//     public year:string,
//     public make: string, 
//     public model: string, 
//     public owner: AccountId, 
//     public dateAcquired: string, 
//     public vehicleNotes: string
//     ) {
//       this.id = idCreator()
//       // this.vehicleServiceHistory = []
//       this.vehicleServiceHistory = new PersistentVector<VehicleService>("vs");
//     }
//     @mutateState()
//     addService(serviceDate: string, serviceNotes: string): void {
//       let serviceToAdd = new VehicleService(serviceDate, serviceNotes);
//       this.vehicleServiceHistory.push(serviceToAdd);
//     }
// }
// @nearBindgen
// class VehicleService {
//   public id: string
//   constructor(public serviceDate: string, public serviceNotes: string) {
//     this.id = idCreator()
//   }
// }
// @nearBindgen
// export class Contract {
//   public vehicles: PersistentVector<Vehicle>;
//   constructor(public contractName:string = 'Vehicle History') {
//     this.vehicles = new PersistentVector<Vehicle>("v");
//     // this.vehicles = []
//   }

//   @mutateState()
//   addVehicle(
//     year:string, 
//     make: string,  
//     model: string,  
//     owner: AccountId, 
//     dateAcquired: string, vehicleNotes: string): void {
//     const newVehicle = new Vehicle(year, make, model, owner, dateAcquired, vehicleNotes);
//     this.vehicles.push(newVehicle)
//   }

//   @mutateState()
//   addVehicleService(
//     vehicleId:string): void {
//     // find vehicle call method on the vehicle we want to add service too
//     // you can't update a service, if an error was made a new service has to be entered with notes
//     for (let i = 0; i < this.vehicles.length; ++i) {
//       if(this.vehicles[i].id === vehicleId){
//         // this.vehicles[i].addService(serviceDate, serviceNotes)
//         this.vehicles[i].make = "Miniiiisisisi"
//         // let serviceToAdd = new VehicleService(serviceDate, serviceNotes);
//         // logging.log("service to add:")
//         // logging.log(serviceToAdd)
//         // logging.log("vehicle history:")
//         // logging.log(this.vehicles[i].vehicleServiceHistory)
       
//         // this.vehicles[i].vehicleServiceHistory.push(serviceToAdd)
//         // logging.log("vehicle history after:")
//         // logging.log(this.vehicles[i].vehicleServiceHistory)
//       }
    
//     // NOTE: LIMITATIONS
//     // this does not work, closures not supported on AS 
//     // this.vehicles = this.vehicles.map<Vehicle>(function(vehicle){
//     //   if(vehicle.id == vehicleId){
//     //     vehicle.addService(serviceDate, serviceNotes)
//     //   }
//     //   return vehicle
//     // })
//     }
//   }
//   // read the given key from account (contract) storage
//   read(key: string): string {
//     if (isKeyInStorage(key)) {
//       return `✅ Key [ ${key} ] has value [ ${storage.getString(key)!} ]`;
//     } else {
//       return `🚫 Key [ ${key} ] not found in storage. ( ${this.storageReport()} )`;
//     }
//   }
 
//   @mutateState()
//   write(key: string, value: string): string {
//     storage.set(key, value);
//     return `✅ Data saved. ( ${this.storageReport()} )`;
//   }

//   // private helper method used by read() and write() above
//   private storageReport(): string {
//     return `storage [ ${Context.storageUsage} bytes ]`;
//   }
// }

// /**
//  * This function exists only to avoid a compiler error
//  *
//  * @param key string key in account storage
//  * @returns boolean indicating whether key exists
//  */
// function isKeyInStorage(key: string): bool {
//   return storage.hasKey(key);
// }


// export function get_contract_state(): Contract {
//   return storage.getSome<Contract>(STATE);
// }

// export function resave_contract(contract: Contract): void {
  //   storage.set(STATE, contract);
  // }
  // public vehicleServiceHistory: Array<VehicleService> = [];


import { storage, PersistentMap, PersistentVector } from "near-sdk-core";
import { AccountId, idCreator, VehicleId, VehicleServiceId } from "../../utils";

const STATE = "STATE";
@nearBindgen
class VehicleService {

  public id: VehicleServiceId
  public vehicleId:VehicleId 
  public serviceDate:string 
  public serviceNotes:string

  constructor(
    vehicleId:VehicleId, 
    serviceDate:string, 
    serviceNotes:string
    ) {
      this.id = idCreator();
      this.vehicleId = vehicleId;
      this.serviceDate = serviceDate;
      this.serviceNotes = serviceNotes
    }
}

@nearBindgen
class Vehicle {
  public id: VehicleId
  public serviceIDs: Array<VehicleServiceId> 
  public services: PersistentVector<VehicleServiceId>
  public year:string
  public make:string 
  public model:string 
  public owner:AccountId
  public dateAcquired:string
  public vehicleNotes:string
  
  constructor(
    year:string,
    make:string, 
    model:string, 
    owner:AccountId,
    dateAcquired:string,
    vehicleNotes:string
    ) {
      this.id = idCreator();
      this.year = year;
      this.make = make;
      this.model = model;
      this.owner = owner;
      this.dateAcquired = dateAcquired;
      this.vehicleNotes = vehicleNotes;
      this.serviceIDs = [];
      this.services = new PersistentVector<VehicleServiceId>("s")
    }
}

@nearBindgen
export class Contract {
  constructor(
    public vehicles: PersistentMap<VehicleId, Vehicle> = new PersistentMap<VehicleId, Vehicle>("v"),
    public vehicleServiceHistory: PersistentMap<VehicleServiceId, VehicleService> = new PersistentMap<VehicleServiceId, VehicleService>("vs"),
  ) {}

  @mutateState()
  addVehicle(
    year:string, 
    make:string,  
    model:string,  
    owner:AccountId, 
    dateAcquired:string, 
    vehicleNotes:string,
    ): void {
    let newVehicle = new Vehicle(year,make, model, owner, dateAcquired, vehicleNotes);
    this.vehicles.set(newVehicle.id, newVehicle);
  }

  @mutateState()
  addService(
    vehicleId:VehicleId,
    serviceDate:string, 
    serviceNotes:string
    ): void { 
    let newVehicleService = new VehicleService(vehicleId, serviceDate, serviceNotes);
    this.vehicleServiceHistory.set(newVehicleService.id, newVehicleService);
  }

  @mutateState()
  addServiceWithServiceId(
    vehicleId:VehicleId,
    serviceDate:string, 
    serviceNotes:string
    ): void { 
    let newVehicleService = new VehicleService(vehicleId, serviceDate, serviceNotes);
    this.vehicleServiceHistory.set(newVehicleService.id, newVehicleService);
    let currentVehicle = this.vehicles.get(vehicleId)
    if(currentVehicle !== null){
      currentVehicle.serviceIDs.push(newVehicleService.id)
      this.vehicles.set(vehicleId, currentVehicle)
    }
  }

  @mutateState()
  addServiceWithServiceId2(
    vehicleId:VehicleId,
    serviceDate:string, 
    serviceNotes:string
    ): void { 
    let newVehicleService = new VehicleService(vehicleId, serviceDate, serviceNotes);
    this.vehicleServiceHistory.set(newVehicleService.id, newVehicleService);
    let currentVehicle = this.vehicles.get(vehicleId)
    if(currentVehicle !== null){
      currentVehicle.services.push(newVehicleService.id)
      this.vehicles.set(vehicleId, currentVehicle)
    }
  }

  @mutateState()
  addServiceId(
    vehicleId:VehicleId,
    vehicleServiceId:VehicleServiceId, 
    ): void { 
    
    let currentVehicle = this.vehicles.get(vehicleId)
    if(currentVehicle !== null){
      currentVehicle.serviceIDs.push(vehicleServiceId)
      this.vehicles.set(vehicleId, currentVehicle)
    }
  }

  @mutateState()
  addServiceId2(
    vehicleId:VehicleId,
    vehicleServiceId:VehicleServiceId, 
    ): void { 
    
    let currentVehicle = this.vehicles.get(vehicleId)
    if(currentVehicle !== null){
      currentVehicle.services.push(vehicleServiceId)
      this.vehicles.set(vehicleId, currentVehicle)
    }
  }
}

// pruba con full id v::afaadf, prueba solo con id 

export function add_vehicle(
  year:string, 
  make:string,  
  model:string,  
  owner:AccountId, 
  dateAcquired:string, 
  vehicleNotes:string
): void {
  // create a new Vehicle instance
  const newVehicle = new Vehicle(year, make, model, owner, dateAcquired, vehicleNotes);

  // get contract STATE
  const currentContractState = get_contract_state();

  // get current vehicles
  const currentVehicles = currentContractState.vehicles;

  // set or update key val pairs
  currentVehicles.set(newVehicle.id, newVehicle);

  // update vehicles
  currentContractState.vehicles = currentVehicles;

  // save contract with new values
  resave_contract(currentContractState);
}

export function add_service(
  vehicleId:VehicleId,
  serviceDate:string, 
  serviceNotes:string
): void {
  // create a new Vehicle instance
  const newVehicleService = new VehicleService(vehicleId, serviceDate, serviceNotes);

  // get contract STATE
  const currentContractState = get_contract_state();

  // get contracts vehicle service
  const currentVehicleService = currentContractState.vehicleServiceHistory;

  // get current vehicles
  const currentVehicles = currentContractState.vehicles;

  // get specific vehicle
  const currentVehicle = currentVehicles.get(vehicleId)

  // add service id to vehicle
  if(currentVehicle !== null){
    currentVehicle.serviceIDs.push(newVehicleService.id)
  }
  
  // set or update key val pairs
  currentVehicleService.set(newVehicleService.id, newVehicleService);

  // update vehicles
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