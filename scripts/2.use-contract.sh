#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for environment variable with contract name"
echo ---------------------------------------------------------
echo

[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

# echo
# echo
# echo ---------------------------------------------------------
# # echo "Read State"
# echo ---------------------------------------------------------
# echo

# near view $CONTRACT read '{"key":"STATE"}'

echo
echo
echo ---------------------------------------------------------
# echo "Step: Add/Update Vehicle Owner"
echo ---------------------------------------------------------
echo


# near call $CONTRACT addOrUpdateVehicleOwner '{"vehicleOwner":"macedo.testnet",  "dateAcquired": "Feb 8 2021"}' --accountId $CONTRACT
# near call $CONTRACT getAllVehicleServiceHistory '{}' --accountId $CONTRACT
# near call $CONTRACT getAllVehicleOwners '{}' --accountId $CONTRACT
# near call $CONTRACT addOrUpdateVehicleOwnerTwo '{"vehicleOwner":"macedo.testnet",  "dateAcquired": "Feb 8 2021"}' --accountId $CONTRACT
# near call $CONTRACT clearVehicles '{}' --accountId $CONTRACT
# near call $CONTRACT clearLastVehicles2 '{}' --accountId $CONTRACT
# near call $CONTRACT clearChangeTwo '{}' --accountId $CONTRACT

# Add First Vehicle --------------------
# near call $CONTRACT addVehicle '{"year":"Feb 8 2021",  "make": "Mini", "model": "BMW",  "owner": "macedo.testnet", "dateAcquired": "Nov 17, 2021", "vehicleNotes": "Brand New"}' --accountId $CONTRACT
# Add Second Vehicle --------------------
# near call $CONTRACT addVehicle '{"year":"Oct 8 2021",  "make": "230i", "model": "BMW", "owner": "macedo.testnet", "dateAcquired": "Nov 20, 2021", "vehicleNotes": "Brand New"}' --accountId $CONTRACT

# Add Vehicle Service via ID--------------------
# near call $CONTRACT addService '{"vehicleId": "72750457", "serviceDate": "Feb 9 2021",  "serviceNotes": "Oil Change"}' --accountId $CONTRACT

# test 1 
near call $CONTRACT addServiceId '{"vehicleId": "72750457", "vehicleServiceId": "72750530"}' --accountId $CONTRACT

# test 2 fail
# near call $CONTRACT addServiceId '{"vehicleId": "v::72748314", "vehicleServiceId": "72748429"}' --accountId $CONTRACT

# test 3 
# near call $CONTRACT addServiceId2 '{"vehicleId": "72748314", "vehicleServiceId": "72748429"}' --accountId $CONTRACT

# test 2 
# near call $CONTRACT addServiceId '{"vehicleId": "v::72748314", "vehicleServiceId": "72748429"}' --accountId $CONTRACT

echo
echo "now run this script again to see changes made by this file"
exit 0
