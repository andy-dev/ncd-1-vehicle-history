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

echo
echo
echo ---------------------------------------------------------
echo "Step 1: Call Methods on Contract"
echo ---------------------------------------------------------
echo


# Add First Vehicle --------------------
# near call $CONTRACT addVehicle '{"year":"Feb 8 2021",  "make": "Mini", "model": "BMW",  "owner": "macedo.testnet", "dateAcquired": "Nov 17, 2021", "vehicleNotes": "Brand New"}' --accountId $CONTRACT

# Add Vehicle Service need vehicle id from above ID--------------------
# near call $CONTRACT addService '{"vehicleId": "72755077", "serviceDate": "Feb 9 2021",  "serviceNotes": "Oil Change"}' --accountId $CONTRACT


echo
echo ---------------------------------------------------------
echo "Goodbye"
echo ---------------------------------------------------------
echo
exit 0
