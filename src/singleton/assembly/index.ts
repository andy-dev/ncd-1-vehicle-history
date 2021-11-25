import { PersistentMap } from "near-sdk-core";
import { AccountId, idCreator, VehicleId, VehicleServiceId } from "../../utils";
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
  public serviceIds: Array<VehicleServiceId> 
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
      this.serviceIds = [];
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
      this.addServiceId(vehicleId, newVehicleService.id)
    }

  @mutateState()
  addServiceId(
    vehicleId:VehicleId,
    vehicleServiceId:VehicleServiceId, 
    ): void {
      let currentVehicle = this.vehicles.get(vehicleId)
      if(currentVehicle !== null){
        currentVehicle.serviceIds.push(vehicleServiceId)
        this.vehicles.set(vehicleId, currentVehicle)
      }
    } 
}
  